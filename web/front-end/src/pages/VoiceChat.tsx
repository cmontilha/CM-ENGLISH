import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const DAILY_LIMIT_SECONDS = 300;
const VOSK_MODEL_URL = "/models/vosk-model-small-en-us-0.15.tar.gz";

const VoiceWave = memo(({ active }: { active: boolean }) => {
  const bars = useMemo(
    () =>
      [0.7, 0.4, 0.9, 0.55, 0.8, 0.45, 0.65].map((height, index) => ({
        height,
        delay: `${index * 120}ms`,
      })),
    []
  );

  return (
    <div className="relative mt-8 h-28 flex items-end justify-center gap-3">
      {bars.map((bar, index) => (
        <span
          key={`wave-${index}`}
          className={cn("voice-wave-bar", active ? "voice-wave-active" : "voice-wave-idle")}
          style={{
            height: `${bar.height * 100}%`,
            animationDelay: bar.delay,
          }}
        />
      ))}
    </div>
  );
});
VoiceWave.displayName = "VoiceWave";

const generateReply = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("oi")) {
    return "Oi! Como posso ajudar com o seu inglês hoje?";
  }
  if (lower.includes("practice") || lower.includes("treinar")) {
    return "Vamos treinar. Escolha um tema e eu te acompanho.";
  }
  if (lower.includes("grammar") || lower.includes("gramática")) {
    return "Bora revisar gramática. Quer tempos verbais ou preposições?";
  }
  return "Legal! Me conte mais para eu responder melhor.";
};

const VoiceChat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [usedSeconds, setUsedSeconds] = useState(0);
  const [modelLoading, setModelLoading] = useState(false);
  const [partial, setPartial] = useState("");
  const sessionId = useMemo(
    () => `session_${crypto.randomUUID()}`,
    []
  );

  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognizerRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const recordingStart = useRef<number | null>(null);

  const remainingSeconds = Math.max(0, DAILY_LIMIT_SECONDS - usedSeconds);
  const remainingLabel = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [remainingSeconds]);

  const loadUsage = useCallback(async () => {
    if (!user?.id) return;
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("voice_chat_usage")
      .select("seconds")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

    if (data?.seconds) {
      setUsedSeconds(data.seconds);
    }
  }, [user?.id]);

  useEffect(() => {
    loadUsage();
  }, [loadUsage]);


  const saveMessage = useCallback(
    async (role: "user" | "assistant", text: string) => {
      if (!user?.id) return;
      await supabase.from("voice_chat_messages").insert({
        user_id: user.id,
        role,
        text,
        session_id: sessionId,
        created_at: new Date().toISOString(),
      });
    },
    [sessionId, user?.id]
  );

  const updateUsage = useCallback(
    async (seconds: number) => {
      if (!user?.id) return;
      const today = new Date().toISOString().slice(0, 10);
      const nextTotal = usedSeconds + seconds;
      setUsedSeconds(nextTotal);
      await supabase.from("voice_chat_usage").upsert({
        user_id: user.id,
        date: today,
        seconds: nextTotal,
      });
    },
    [usedSeconds, user?.id]
  );

  const loadModel = useCallback(async () => {
    if (modelRef.current || modelLoading) return modelRef.current;
    setModelLoading(true);
    try {
      const { createModel } = await import("vosk-browser");
      const model = await Promise.race([
        createModel(VOSK_MODEL_URL),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 15000)
        ),
      ]);
      modelRef.current = model;
      return model;
    } catch {
      setError(
        "Nao foi possivel carregar o modelo Vosk. Verifique se o arquivo .tar.gz esta em /public/models."
      );
      throw new Error("vosk-load-failed");
    } finally {
      setModelLoading(false);
    }
  }, [modelLoading]);

  const cleanupAudio = useCallback(() => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close();
    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
    recognizerRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudio();
      window.speechSynthesis?.cancel();
      modelRef.current?.terminate?.();
    };
  }, [cleanupAudio]);

  const startRecording = useCallback(async () => {
    setError(null);
    if (usedSeconds >= DAILY_LIMIT_SECONDS) {
      setError("Limite diario de 5 minutos atingido.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Seu navegador nao suporta captura de audio.");
      return;
    }
    try {
      const model = await loadModel();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      const recognizer = new model.KaldiRecognizer(16000);
      recognizerRef.current = recognizer;
      recognizer.on("partialresult", (message: { result?: { partial?: string } }) => {
        setPartial(message.result?.partial ?? "");
      });
      recognizer.on("result", (message: { result?: { text?: string } }) => {
        if (message.result?.text) {
          setTranscript(message.result.text);
        }
      });

      processor.onaudioprocess = (event) => {
        try {
          const input = event.inputBuffer.getChannelData(0);
          recognizer.acceptWaveform(input);
        } catch (processingError) {
          console.error("acceptWaveform failed", processingError);
        }
      };

      source.connect(processor);
      const zeroGain = audioContext.createGain();
      zeroGain.gain.value = 0;
      processor.connect(zeroGain);
      zeroGain.connect(audioContext.destination);
      recordingStart.current = Date.now();
      setIsRecording(true);
    } catch {
      setError("Nao foi possivel acessar o microfone.");
      cleanupAudio();
    }
  }, [cleanupAudio, loadModel, usedSeconds]);

  const stopRecording = useCallback(async () => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsTranscribing(true);
    try {
      const durationMs = recordingStart.current ? Date.now() - recordingStart.current : 0;
      const durationSeconds = Math.ceil(durationMs / 1000);
      recordingStart.current = null;
      if (durationSeconds > 0) {
        await updateUsage(durationSeconds);
      }

      const recognizer = recognizerRef.current;
      const finalResult = recognizer?.finalResult ? recognizer.finalResult() : null;
      const text = (finalResult?.result?.text ?? transcript) || partial || "";
      const safeText = text || "Nao consegui entender, pode repetir?";
      setTranscript(safeText);
      setPartial("");
      await saveMessage("user", safeText);

      const reply = generateReply(safeText);
      setAssistantReply(reply);
      await saveMessage("assistant", reply);

      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      setError("Erro ao processar o audio.");
    } finally {
      cleanupAudio();
      setIsTranscribing(false);
    }
  }, [cleanupAudio, isRecording, partial, saveMessage, transcript, updateUsage]);

  const waveActive = isRecording || isTranscribing || isSpeaking;

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div className="glass-card p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-secondary/15 to-accent/20 pointer-events-none" />
            <div className="relative space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                Voice Chat
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                How can I help you today?
              </h1>
              <p className="text-sm text-muted-foreground">
                Tempo restante hoje: {remainingLabel}
              </p>
            </div>
            <VoiceWave active={waveActive} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass-card p-5 space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Você disse
              </p>
              <p className="text-base text-foreground">
                {transcript || partial || "Toque no microfone para começar."}
              </p>
            </div>
            <div className="glass-card p-5 space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Assistente
              </p>
              <p className="text-base text-foreground">
                {assistantReply || "Sua resposta aparecerá aqui."}
              </p>
            </div>
          </div>

          {error && (
            <div className="glass-card p-4 text-center text-sm text-rose-200 bg-rose-500/10 border-rose-500/30">
              {error}
            </div>
          )}
          {modelLoading && (
            <p className="text-sm text-muted-foreground text-center">
              Carregando modelo Vosk...
            </p>
          )}
          {isTranscribing && (
            <p className="text-sm text-muted-foreground text-center">
              Transcrevendo audio...
            </p>
          )}

          <div className="flex justify-center">
            <Button
              size="lg"
              className={cn(
                "rounded-full px-8 py-6 text-base font-semibold btn-glow",
                isRecording ? "bg-accent text-white" : "bg-primary text-white"
              )}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing || isSpeaking || modelLoading}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5 mr-2" />
                  Gravando...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Tap to record
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;

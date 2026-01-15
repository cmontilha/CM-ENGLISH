import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import * as FileSystem from "expo-file-system";
import Screen from "../components/Screen";
import { colors } from "../theme/colors";
import { supabase } from "../integrations/supabase/client";
import { getOrCreateDeviceId } from "../utils/deviceId";
import BackButton from "../components/BackButton";

const DAILY_LIMIT_SECONDS = 300;
const VOSK_MODEL_DIR = `${FileSystem.documentDirectory ?? ""}vosk-model-small-en-us-0.15`;
const VOSK_MODEL_URL =
  "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip";

const generateSessionId = () =>
  `session_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const generateReply = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("oi")) {
    return "Oi! Como posso te ajudar no seu inglês hoje?";
  }
  if (lower.includes("practice") || lower.includes("treinar")) {
    return "Vamos treinar. Que tema você gostaria de praticar agora?";
  }
  if (lower.includes("grammar") || lower.includes("gramática")) {
    return "Gramática é ótima! Quer revisar tempos verbais ou preposições?";
  }
  return "Entendi! Me conte um pouco mais para eu te ajudar melhor.";
};

const VoiceChatScreen = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [sessionId] = useState(generateSessionId);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [usedSeconds, setUsedSeconds] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const recordingStart = useRef<number | null>(null);

  const waveValues = useRef(
    Array.from({ length: 7 }, (_, index) => ({
      value: new Animated.Value(0.6),
      delay: 120 * index,
    }))
  ).current;

  const waveActive = isRecording || isTranscribing || isSpeaking;

  useEffect(() => {
    getOrCreateDeviceId().then(setDeviceId);
  }, []);

  const loadUsage = useCallback(async () => {
    if (!deviceId) return;
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("voice_chat_usage")
      .select("seconds")
      .eq("user_id", deviceId)
      .eq("date", today)
      .maybeSingle();

    if (data?.seconds) {
      setUsedSeconds(data.seconds);
    }
  }, [deviceId]);

  useEffect(() => {
    if (deviceId) {
      loadUsage();
    }
  }, [deviceId, loadUsage]);

  useEffect(() => {
    const animations = waveValues.map(({ value, delay }) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1.3,
            duration: 420 + delay,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.5,
            duration: 480 + delay,
            useNativeDriver: true,
          }),
        ])
      )
    );

    if (waveActive) {
      animations.forEach((animation) => animation.start());
    } else {
      animations.forEach((animation) => animation.stop());
      waveValues.forEach(({ value }) => value.setValue(0.6));
    }

    return () => {
      animations.forEach((animation) => animation.stop());
    };
  }, [waveActive, waveValues]);

  const ensureModelReady = useCallback(async () => {
    if (modelReady || modelLoading) return;
    setModelLoading(true);
    const info = await FileSystem.getInfoAsync(VOSK_MODEL_DIR);
    if (info.exists) {
      setModelReady(true);
      setModelLoading(false);
      return;
    }
    try {
      const zipPath = `${FileSystem.documentDirectory ?? ""}vosk-model.zip`;
      await FileSystem.downloadAsync(VOSK_MODEL_URL, zipPath);
      setModelReady(true);
    } catch {
      setError("Nao foi possivel baixar o modelo Vosk.");
    } finally {
      setModelLoading(false);
    }
  }, [modelReady, modelLoading]);

  const transcribeAudio = useCallback(async (audioUri: string) => {
    try {
      const voskModule = await import("react-native-vosk");
      const transcribe = (voskModule as { transcribe?: (options: { modelPath: string; uri: string }) => Promise<{ text?: string }> })
        .transcribe;
      if (!transcribe) {
        return "";
      }
      const result = await transcribe({
        modelPath: VOSK_MODEL_DIR,
        uri: audioUri,
      });
      return result?.text ?? "";
    } catch {
      return "";
    }
  }, []);

  const saveMessage = useCallback(
    async (role: "user" | "assistant", text: string) => {
      if (!deviceId) return;
      await supabase.from("voice_chat_messages").insert({
        user_id: deviceId,
        role,
        text,
        session_id: sessionId,
        created_at: new Date().toISOString(),
      });
    },
    [deviceId, sessionId]
  );

  const updateUsage = useCallback(
    async (seconds: number) => {
      if (!deviceId) return;
      const today = new Date().toISOString().slice(0, 10);
      const nextTotal = usedSeconds + seconds;
      setUsedSeconds(nextTotal);
      await supabase.from("voice_chat_usage").upsert({
        user_id: deviceId,
        date: today,
        seconds: nextTotal,
      });
    },
    [deviceId, usedSeconds]
  );

  const handleStartRecording = useCallback(async () => {
    setError(null);
    if (usedSeconds >= DAILY_LIMIT_SECONDS) {
      setError("Limite diario de 5 minutos atingido.");
      return;
    }
    await ensureModelReady();
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        setError("Permissao de microfone negada.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingInstance = new Audio.Recording();
      await recordingInstance.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recordingInstance.startAsync();
      setRecording(recordingInstance);
      setIsRecording(true);
      recordingStart.current = Date.now();
    } catch {
      setError("Nao foi possivel iniciar a gravacao.");
    }
  }, [ensureModelReady, usedSeconds]);

  const handleStopRecording = useCallback(async () => {
    if (!recording) return;
    setIsRecording(false);
    setIsTranscribing(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const durationMs = recordingStart.current ? Date.now() - recordingStart.current : 0;
      const durationSeconds = Math.ceil(durationMs / 1000);
      recordingStart.current = null;
      setRecording(null);

      if (durationSeconds > 0) {
        await updateUsage(durationSeconds);
      }

      if (!uri) {
        setError("Nao foi possivel acessar o audio.");
        setIsTranscribing(false);
        return;
      }

      const text = await transcribeAudio(uri);
      const safeText = text || "Nao consegui entender, pode repetir?";
      setTranscript(safeText);
      await saveMessage("user", safeText);

      const reply = generateReply(safeText);
      setAssistantReply(reply);
      await saveMessage("assistant", reply);

      setIsSpeaking(true);
      Speech.speak(reply, {
        rate: 0.95,
        pitch: 1.05,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    } catch {
      setError("Erro ao processar o audio.");
    } finally {
      setIsTranscribing(false);
    }
  }, [recording, saveMessage, transcribeAudio, updateUsage]);

  const remainingSeconds = Math.max(0, DAILY_LIMIT_SECONDS - usedSeconds);
  const remainingLabel = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [remainingSeconds]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <BackButton />
        <Text style={styles.title}>Voice Chat</Text>
        <Text style={styles.subtitle}>Fale em ingles e receba respostas em tempo real.</Text>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>How can I help you today?</Text>
          <Text style={styles.heroSubtitle}>Tempo restante hoje: {remainingLabel}</Text>

          <View style={styles.wave}>
            {waveValues.map(({ value }, index) => (
              <Animated.View
                key={`wave-${index}`}
                style={[
                  styles.waveBar,
                  {
                    transform: [{ scaleY: value }],
                    opacity: waveActive ? 1 : 0.6,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Você disse</Text>
          <Text style={styles.cardText}>{transcript || "Toque para começar a gravar."}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Assistente</Text>
          <Text style={styles.cardText}>
            {assistantReply || "Sua resposta aparecerá aqui."}
          </Text>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
        {modelLoading && <Text style={styles.status}>Carregando modelo Vosk...</Text>}
        {isTranscribing && <Text style={styles.status}>Transcrevendo audio...</Text>}

        <Pressable
          style={[
            styles.recordButton,
            isRecording ? styles.recordButtonActive : null,
          ]}
          onPress={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isTranscribing || isSpeaking || modelLoading}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={28}
            color={colors.white}
          />
          <Text style={styles.recordText}>
            {isRecording ? "Gravando..." : "Tap to record"}
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 120,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mutedText,
  },
  hero: {
    backgroundColor: "rgba(21, 16, 40, 0.88)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(132, 80, 255, 0.4)",
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 6,
    fontSize: 12,
  },
  wave: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 20,
    height: 60,
  },
  waveBar: {
    width: 12,
    height: 42,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 6,
  },
  cardLabel: {
    color: colors.mutedText,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardText: {
    color: colors.text,
    fontSize: 15,
  },
  recordButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
  },
  recordButtonActive: {
    backgroundColor: colors.accent,
  },
  recordText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  status: {
    color: colors.mutedText,
    textAlign: "center",
  },
  error: {
    color: "hsl(350, 78%, 56%)",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default VoiceChatScreen;

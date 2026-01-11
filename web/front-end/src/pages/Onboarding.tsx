import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Plane, 
  Briefcase, 
  GraduationCap, 
  Rocket,
  Clock,
  ChevronRight,
  Check,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";

interface GoalOption {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

const goals: GoalOption[] = [
  { id: "travel", icon: Plane, label: "Viajar pelo mundo", description: "Conversar e se virar em viagens" },
  { id: "work", icon: Briefcase, label: "Trabalho", description: "Comunicar-se profissionalmente" },
  { id: "study", icon: GraduationCap, label: "Estudos", description: "Preparação para provas e intercâmbio" },
  { id: "fluency", icon: Rocket, label: "Fluência total", description: "Domínio completo do idioma" },
];

const levels = [
  { id: "beginner", label: "Iniciante", description: "Sei poucas palavras ou nada" },
  { id: "elementary", label: "Básico", description: "Consigo frases simples" },
  { id: "intermediate", label: "Intermediário", description: "Mantenho conversas básicas" },
  { id: "advanced", label: "Avançado", description: "Preciso apenas polir" },
];

const dailyTimes = [
  { id: "5", label: "5 min", description: "Casual" },
  { id: "10", label: "10 min", description: "Regular" },
  { id: "15", label: "15 min", description: "Sério" },
  { id: "20", label: "20 min", description: "Intensivo" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selections, setSelections] = useState({
    goal: "",
    level: "",
    dailyTime: "",
  });

  const steps = [
    {
      title: "Qual seu objetivo?",
      subtitle: "Isso nos ajuda a personalizar sua trilha",
      options: goals,
      key: "goal",
    },
    {
      title: "Qual seu nível atual?",
      subtitle: "Seja honesto - vamos do seu ponto de partida",
      options: levels,
      key: "level",
    },
    {
      title: "Quanto tempo por dia?",
      subtitle: "Consistência é mais importante que quantidade",
      options: dailyTimes,
      key: "dailyTime",
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleSelect = (value: string) => {
    setSelections({ ...selections, [currentStep.key]: value });
  };

  const handleNext = async () => {
    if (!selections[currentStep.key as keyof typeof selections]) {
      toast({
        title: "Selecione uma opção",
        description: "Por favor, escolha uma opção para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (isLastStep) {
      await handleComplete();
    } else {
      setStep(step + 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      navigate("/auth?mode=login");
      return;
    }

    setLoading(true);
    try {
      // For now, just navigate - database will be set up later
      console.log("Onboarding data:", selections);

      toast({
        title: "Perfil configurado!",
        description: "Sua trilha personalizada está pronta.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding:", error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                index <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-display font-bold mb-2">
                {currentStep.title}
              </h1>
              <p className="text-muted-foreground">{currentStep.subtitle}</p>
            </div>

            <div className="space-y-3">
              {currentStep.options.map((option) => {
                const isSelected =
                  selections[currentStep.key as keyof typeof selections] ===
                  option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    {"icon" in option && (
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {(() => {
                          const IconComp = (option as GoalOption).icon;
                          return <IconComp className="w-6 h-6" />;
                        })()}
                      </div>
                    )}
                    {"icon" in option === false && (
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {option.label}
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Voltar
                </Button>
              )}
              <Button
                variant="glow"
                onClick={handleNext}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  "Salvando..."
                ) : isLastStep ? (
                  "Começar a aprender!"
                ) : (
                  <>
                    Continuar <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;

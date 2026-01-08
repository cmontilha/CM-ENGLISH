import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { 
  X, 
  Heart, 
  Zap, 
  Check, 
  ChevronRight,
  Volume2,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

// Exercise types
type ExerciseType = "multiple-choice" | "fill-blank" | "word-order" | "listening";

interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  hint?: string;
  audio?: string;
}

// Mock exercises
const mockExercises: Exercise[] = [
  {
    id: "1",
    type: "multiple-choice",
    question: "Como se diz 'Olá' em inglês?",
    options: ["Goodbye", "Hello", "Thanks", "Please"],
    correctAnswer: "Hello",
  },
  {
    id: "2",
    type: "fill-blank",
    question: "Complete: My name ___ John.",
    options: ["am", "is", "are", "be"],
    correctAnswer: "is",
  },
  {
    id: "3",
    type: "word-order",
    question: "Ordene para formar: 'Como você está?'",
    options: ["you", "How", "are", "?"],
    correctAnswer: ["How", "are", "you", "?"],
  },
  {
    id: "4",
    type: "multiple-choice",
    question: "Qual é o plural de 'child'?",
    options: ["childs", "childes", "children", "childrens"],
    correctAnswer: "children",
  },
  {
    id: "5",
    type: "fill-blank",
    question: "Complete: She ___ a teacher.",
    options: ["am", "is", "are", "be"],
    correctAnswer: "is",
  },
];

const LessonPlayer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [xp, setXp] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const exercises = mockExercises;
  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex) / exercises.length) * 100;

  useEffect(() => {
    // Reset state when exercise changes
    setSelectedAnswer(null);
    setOrderedWords([]);
    setIsChecked(false);
    setIsCorrect(false);
  }, [currentIndex]);

  const handleSelectAnswer = (answer: string) => {
    if (isChecked) return;

    if (currentExercise.type === "word-order") {
      if (orderedWords.includes(answer)) {
        setOrderedWords(orderedWords.filter((w) => w !== answer));
      } else {
        setOrderedWords([...orderedWords, answer]);
      }
    } else {
      setSelectedAnswer(answer);
    }
  };

  const handleCheck = () => {
    if (isChecked) {
      // Move to next exercise
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Lesson complete!
        handleLessonComplete();
      }
      return;
    }

    let correct = false;

    if (currentExercise.type === "word-order") {
      const correctArray = currentExercise.correctAnswer as string[];
      correct = JSON.stringify(orderedWords) === JSON.stringify(correctArray);
    } else {
      correct = selectedAnswer === currentExercise.correctAnswer;
    }

    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      setXp(xp + 10);
      toast({
        title: "Correto! 🎉",
        description: "+10 XP",
      });
    } else {
      setLives(lives - 1);
      if (lives <= 1) {
        handleGameOver();
      }
    }
  };

  const handleLessonComplete = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setShowResult(true);
  };

  const handleGameOver = () => {
    toast({
      title: "Game Over!",
      description: "Você ficou sem vidas. Tente novamente!",
      variant: "destructive",
    });
    navigate("/courses");
  };

  const handleExit = () => {
    navigate("/courses");
  };

  const canCheck =
    currentExercise.type === "word-order"
      ? orderedWords.length === currentExercise.options?.length
      : selectedAnswer !== null;

  if (showResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-secondary mx-auto mb-6 flex items-center justify-center">
            <Check className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">
            Lição Completa! 🎉
          </h1>
          <p className="text-muted-foreground mb-6">
            Você ganhou {xp} XP nesta lição
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-card p-4">
              <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{xp}</p>
              <p className="text-xs text-muted-foreground">XP ganho</p>
            </div>
            <div className="glass-card p-4">
              <Heart className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold">{lives}</p>
              <p className="text-xs text-muted-foreground">Vidas restantes</p>
            </div>
          </div>

          <Button
            variant="glow"
            size="lg"
            className="w-full"
            onClick={() => navigate("/courses")}
          >
            Continuar <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <button onClick={handleExit}>
          <X className="w-6 h-6 text-muted-foreground hover:text-foreground" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        {/* Lives */}
        <div className="flex items-center gap-1">
          <Heart className="w-5 h-5 text-destructive" />
          <span className="font-bold">{lives}</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-bold">{xp}</span>
        </div>
      </header>

      {/* Exercise Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            {/* Question */}
            <div className="mb-8">
              <span className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                {currentExercise.type === "multiple-choice" && "Escolha a correta"}
                {currentExercise.type === "fill-blank" && "Complete a frase"}
                {currentExercise.type === "word-order" && "Ordene as palavras"}
                {currentExercise.type === "listening" && "Ouça e responda"}
              </span>
              <h2 className="text-xl md:text-2xl font-display font-bold">
                {currentExercise.question}
              </h2>
            </div>

            {/* Word Order Display */}
            {currentExercise.type === "word-order" && (
              <div className="mb-6 min-h-[60px] p-4 rounded-xl border-2 border-dashed border-border flex flex-wrap gap-2">
                {orderedWords.map((word, index) => (
                  <motion.button
                    key={`ordered-${index}`}
                    layoutId={word}
                    onClick={() => handleSelectAnswer(word)}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
                    whileTap={{ scale: 0.95 }}
                  >
                    {word}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Options */}
            <div
              className={`grid gap-3 ${
                currentExercise.type === "word-order"
                  ? "grid-cols-2 md:grid-cols-4"
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              {currentExercise.options?.map((option) => {
                const isSelected =
                  currentExercise.type === "word-order"
                    ? orderedWords.includes(option)
                    : selectedAnswer === option;

                const showCorrect =
                  isChecked &&
                  (currentExercise.type === "word-order"
                    ? (currentExercise.correctAnswer as string[]).includes(option)
                    : option === currentExercise.correctAnswer);

                const showWrong =
                  isChecked && isSelected && !isCorrect && !showCorrect;

                return (
                  <motion.button
                    key={option}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={
                      isChecked ||
                      (currentExercise.type === "word-order" && orderedWords.includes(option))
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected && !isChecked
                        ? "border-primary bg-primary/10"
                        : showCorrect
                        ? "border-neon-green bg-neon-green/10"
                        : showWrong
                        ? "border-destructive bg-destructive/10"
                        : orderedWords.includes(option)
                        ? "border-transparent bg-transparent opacity-30"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">{option}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Actions */}
        <div className="mt-auto pt-6">
          {isChecked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl mb-4 ${
                isCorrect
                  ? "bg-neon-green/10 border border-neon-green/30"
                  : "bg-destructive/10 border border-destructive/30"
              }`}
            >
              <p className="font-medium">
                {isCorrect ? "Excelente! ✨" : "Não foi dessa vez 😅"}
              </p>
              {!isCorrect && (
                <p className="text-sm text-muted-foreground mt-1">
                  Resposta correta:{" "}
                  {Array.isArray(currentExercise.correctAnswer)
                    ? currentExercise.correctAnswer.join(" ")
                    : currentExercise.correctAnswer}
                </p>
              )}
            </motion.div>
          )}

          <Button
            variant={isChecked ? (isCorrect ? "success" : "default") : "glow"}
            size="lg"
            className="w-full"
            onClick={handleCheck}
            disabled={!canCheck && !isChecked}
          >
            {isChecked ? (
              currentIndex < exercises.length - 1 ? (
                <>
                  Continuar <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                "Finalizar Lição"
              )
            ) : (
              "Verificar"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LessonPlayer;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";

interface ReviewItem {
  id: string;
  word: string;
  translation: string;
  example: string;
  attempts: number;
  lastAttempt?: Date;
}

// Mock review items
const mockReviewItems: ReviewItem[] = [
  { id: "1", word: "Hello", translation: "Olá", example: "Hello, how are you?", attempts: 3 },
  { id: "2", word: "Goodbye", translation: "Tchau", example: "Goodbye, see you tomorrow!", attempts: 2 },
  { id: "3", word: "Please", translation: "Por favor", example: "Please help me.", attempts: 1 },
  { id: "4", word: "Thank you", translation: "Obrigado", example: "Thank you very much!", attempts: 2 },
  { id: "5", word: "Sorry", translation: "Desculpa", example: "I'm sorry for being late.", attempts: 1 },
];

const Review = () => {
  const [items, setItems] = useState(mockReviewItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  const currentItem = items[currentIndex];
  const hasItems = items.length > 0 && currentIndex < items.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (knew: boolean) => {
    setReviewed(reviewed + 1);
    if (knew) {
      setCorrect(correct + 1);
    }

    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setShowComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewed(0);
    setCorrect(0);
    setShowComplete(false);
  };

  if (showComplete) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Navbar />
        <main className="container mx-auto px-4 pt-20 md:pt-24 flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-secondary mx-auto mb-6 flex items-center justify-center">
              <Check className="w-10 h-10 text-background" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">
              Revisão Completa! 🎉
            </h1>
            <p className="text-muted-foreground mb-6">
              Você revisou {reviewed} palavras
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-4">
                <Check className="w-6 h-6 text-neon-green mx-auto mb-2" />
                <p className="text-2xl font-bold">{correct}</p>
                <p className="text-xs text-muted-foreground">Acertou</p>
              </div>
              <div className="glass-card p-4">
                <X className="w-6 h-6 text-destructive mx-auto mb-2" />
                <p className="text-2xl font-bold">{reviewed - correct}</p>
                <p className="text-xs text-muted-foreground">Para revisar</p>
              </div>
            </div>

            <Button variant="glow" size="lg" className="w-full" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Revisar Novamente
            </Button>
          </motion.div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />

      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            <span className="gradient-text">Revisão</span> Inteligente
          </h1>
          <p className="text-muted-foreground">
            {hasItems
              ? `${items.length - currentIndex} palavras pendentes`
              : "Nenhuma palavra para revisar"}
          </p>
        </motion.div>

        {hasItems ? (
          <div className="max-w-md mx-auto">
            {/* Progress */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(currentIndex / items.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1}/{items.length}
              </span>
            </div>

            {/* Flashcard */}
            <div className="perspective-1000 mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id + (isFlipped ? "-back" : "-front")}
                  initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleFlip}
                  className="glass-card p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer card-hover"
                >
                  {!isFlipped ? (
                    <>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                        Inglês
                      </span>
                      <h2 className="text-3xl font-display font-bold gradient-text mb-4">
                        {currentItem.word}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Toque para ver a tradução
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                        Português
                      </span>
                      <h2 className="text-3xl font-display font-bold text-secondary mb-4">
                        {currentItem.translation}
                      </h2>
                      <p className="text-sm text-muted-foreground italic">
                        "{currentItem.example}"
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions */}
            {isFlipped && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleAnswer(false)}
                  className="border-destructive/50 hover:bg-destructive/10"
                >
                  <X className="w-5 h-5 mr-2 text-destructive" />
                  Não sabia
                </Button>
                <Button
                  variant="glow"
                  size="lg"
                  onClick={() => handleAnswer(true)}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Sabia!
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="glass-card p-8 text-center max-w-md mx-auto">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold mb-2">
              Tudo revisado!
            </h2>
            <p className="text-muted-foreground">
              Volte depois de completar mais lições para revisar novas palavras.
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Review;

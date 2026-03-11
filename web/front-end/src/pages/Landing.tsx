import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Zap, Trophy, Target, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

const features = [
  {
    icon: Target,
    title: "Trilhas Personalizadas",
    description: "Do zero à fluência com um caminho feito para você",
  },
  {
    icon: Zap,
    title: "Exercícios Gamificados",
    description: "Aprenda jogando com lições curtas e divertidas",
  },
  {
    icon: Trophy,
    title: "Sistema de XP & Streak",
    description: "Mantenha sua sequência e suba de nível",
  },
  {
    icon: Star,
    title: "Revisão Inteligente",
    description: "Algoritmo SRS para nunca esquecer o que aprendeu",
  },
];

const levels = [
  { name: "A1 - Beginner", color: "from-secondary to-primary" },
  { name: "A2 - Elementary", color: "from-accent to-secondary" },
  { name: "B1 - Intermediate", color: "from-neon-green to-secondary" },
  { name: "B2 - Upper Intermediate", color: "from-primary to-neon-green" },
  { name: "C1 - Advanced", color: "from-secondary to-accent" },
  { name: "C2 - Proficiency", color: "from-accent to-primary" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const rotatingHeroWords = [
  "Vida Real",
  "Viagens",
  "Entrevistas",
  "Reuniões",
  "Networking",
];

const Landing = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [isDeletingWord, setIsDeletingWord] = useState(false);

  useEffect(() => {
    const currentWord = rotatingHeroWords[wordIndex];
    const typingSpeed = isDeletingWord ? 45 : 85;

    let timeoutId: ReturnType<typeof setTimeout>;

    if (!isDeletingWord && typedWord === currentWord) {
      timeoutId = setTimeout(() => setIsDeletingWord(true), 1400);
    } else if (isDeletingWord && typedWord === "") {
      timeoutId = setTimeout(() => {
        setIsDeletingWord(false);
        setWordIndex((prev) => (prev + 1) % rotatingHeroWords.length);
      }, 220);
    } else {
      timeoutId = setTimeout(() => {
        const nextLength = isDeletingWord ? typedWord.length - 1 : typedWord.length + 1;
        setTypedWord(currentWord.slice(0, nextLength));
      }, typingSpeed);
    }

    return () => clearTimeout(timeoutId);
  }, [isDeletingWord, typedWord, wordIndex]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/background1.png')" }}
          />
          <div className="absolute inset-0 hero-content-focus" />
          <div className="absolute inset-0 bg-background/34" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/24 via-background/8 to-background/62" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto text-center px-2 md:px-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="relative z-10"
            >
                <img
                  src="/logo.png"
                  alt="CM English"
                  className="w-52 h-52 md:w-64 md:h-64 object-contain mx-auto -mt-8 md:-mt-10 -mb-8"
                />

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/35 bg-primary/10 text-xs uppercase tracking-[0.16em] text-primary mb-6">
                  Inglês com prática guiada
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-[1.05]">
                  <span className="hero-title-readable block">Aprenda Inglês para</span>
                  <span className="hero-rotating-word gradient-text mt-2 inline-flex min-w-[12ch] justify-center items-center">
                    {typedWord || "\u00A0"}
                    <span className="typewriter-caret" />
                  </span>
                </h1>

                <p className="hero-subtitle-readable text-lg md:text-2xl mb-9 max-w-3xl mx-auto">
                  Trilhas personalizadas, exercícios gamificados e revisão inteligente.
                  Fluência real para situações do dia a dia.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link to="/auth?mode=register">
                    <Button size="xl" variant="glow" className="w-full sm:w-auto px-8">
                      <Play className="w-5 h-5" />
                      Começar Grátis
                    </Button>
                  </Link>
                  <Link to="/auth?mode=login">
                    <Button size="xl" variant="outline" className="w-full sm:w-auto px-8">
                      Já tenho conta
                    </Button>
                  </Link>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-10 text-muted-foreground text-sm"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/40 border border-border/30">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span>Acesso vitalício</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/40 border border-border/30">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span>Mobile-first</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/40 border border-border/30">
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                    <span>Certificado</span>
                  </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-display font-bold mb-4"
            >
              Por que o <span className="gradient-text-cyan">CM ENGLISH</span>?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Combinamos o melhor das plataformas de cursos com a gamificação
              que torna o aprendizado viciante.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card relative overflow-hidden p-6 card-hover group border border-border/50 hover:border-primary/35"
              >
                <div className="pointer-events-none absolute -top-8 -right-10 w-28 h-28 rounded-full bg-primary/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="pointer-events-none absolute -bottom-10 -left-8 w-24 h-24 rounded-full bg-secondary/12 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.35)] transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 transition-colors group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm transition-colors group-hover:text-foreground/85">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/7 via-transparent to-accent/7" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-display font-bold mb-4"
            >
              Sua jornada do <span className="gradient-text">A1 ao C2</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Níveis estruturados seguindo o CEFR europeu, com conteúdo prático
              para situações reais.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-4"
          >
            {levels.map((level, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card p-4 card-hover"
              >
                <h3 className="font-semibold">{level.name}</h3>
                <div className="progress-bar mt-2">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.max(10, 100 - index * 12)}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 CM ENGLISH. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Termos
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Zap, Trophy, Target, Star, ArrowRight, CheckCircle } from "lucide-react";
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
  { name: "A0 - Absolute Beginner", color: "from-primary to-accent" },
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

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-2">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto -mt-14"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center -mb-12"
            >
              <img
                src="/logo.png"
                alt="CM English"
                className="w-64 h-64 md:w-80 md:h-80 object-contain"
              />
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
            >
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-sm text-foreground">+10.000 alunos ativos</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              Aprenda Inglês para a{" "}
              <span className="gradient-text">Vida Real</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Trilhas personalizadas, exercícios gamificados e revisão inteligente.
              Do zero à fluência no seu ritmo.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/auth?mode=register">
                <Button size="xl" variant="glow" className="w-full sm:w-auto">
                  <Play className="w-5 h-5" />
                  Começar Grátis
                </Button>
              </Link>
              <Link to="/auth?mode=login">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  Já tenho conta
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-6 mt-12 text-muted-foreground text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span>Acesso vitalício</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span>Mobile-first</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span>Certificado</span>
              </div>
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
                className="glass-card p-6 card-hover group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
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
              Sua jornada de <span className="gradient-text">A0 a C2</span>
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
                className="glass-card p-4 flex items-center gap-4 card-hover"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center font-display font-bold text-background`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{level.name}</h3>
                  <div className="progress-bar mt-2">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${Math.max(10, 100 - index * 12)}%` }}
                    />
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 text-center neon-border"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Pronto para dominar o inglês?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Junte-se a milhares de alunos e comece sua jornada hoje mesmo.
              Sem cartão de crédito necessário.
            </p>
            <Link to="/auth?mode=register">
              <Button size="xl" variant="glow">
                <Play className="w-5 h-5" />
                Começar Gratuitamente
              </Button>
            </Link>
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

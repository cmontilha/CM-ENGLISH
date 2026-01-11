import { motion } from "framer-motion";
import { ChevronRight, Lock, CheckCircle, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: number;
  completedLessons: number;
  locked: boolean;
  color: string;
}

interface Course {
  id: string;
  level: string;
  title: string;
  description: string;
  modules: Module[];
  progress: number;
}

const courses: Course[] = [
  {
    id: "a0",
    level: "A0",
    title: "Absolute Beginner",
    description: "Primeiro contato com o inglês",
    progress: 0,
    modules: [
      {
        id: "a0-m1",
        title: "Alphabet & Sounds",
        description: "Aprenda o alfabeto e sons básicos",
        lessons: 6,
        completedLessons: 0,
        locked: false,
        color: "from-primary to-accent",
      },
      {
        id: "a0-m2",
        title: "Greetings & Introductions",
        description: "Como se apresentar e cumprimentar",
        lessons: 7,
        completedLessons: 0,
        locked: false,
        color: "from-secondary to-primary",
      },
      {
        id: "a0-m3",
        title: "Numbers & Counting",
        description: "Números de 1 a 100",
        lessons: 6,
        completedLessons: 0,
        locked: false,
        color: "from-accent to-neon-green",
      },
      {
        id: "a0-m4",
        title: "Classroom Words",
        description: "Objetos, comandos e frases básicas",
        lessons: 5,
        completedLessons: 0,
        locked: false,
        color: "from-neon-green to-secondary",
      },
      {
        id: "a0-m5",
        title: "Basic Questions",
        description: "Perguntas simples do dia a dia",
        lessons: 6,
        completedLessons: 0,
        locked: false,
        color: "from-primary to-secondary",
      },
    ],
  },
  {
    id: "a1",
    level: "A1",
    title: "Beginner",
    description: "Fundamentos essenciais",
    progress: 0,
    modules: [
      {
        id: "a1-m1",
        title: "Daily Routines",
        description: "Descreva sua rotina diária",
        lessons: 6,
        completedLessons: 0,
        locked: true,
        color: "from-primary to-secondary",
      },
      {
        id: "a1-m2",
        title: "Family & Friends",
        description: "Fale sobre pessoas importantes",
        lessons: 6,
        completedLessons: 0,
        locked: true,
        color: "from-accent to-primary",
      },
      {
        id: "a1-m3",
        title: "Food & Drinks",
        description: "Pedidos, preferências e hábitos",
        lessons: 7,
        completedLessons: 0,
        locked: true,
        color: "from-secondary to-accent",
      },
      {
        id: "a1-m4",
        title: "Places & Directions",
        description: "Como pedir e dar direções",
        lessons: 6,
        completedLessons: 0,
        locked: true,
        color: "from-neon-green to-secondary",
      },
      {
        id: "a1-m5",
        title: "Time & Dates",
        description: "Horas, datas e compromissos",
        lessons: 5,
        completedLessons: 0,
        locked: true,
        color: "from-primary to-neon-green",
      },
    ],
  },
  {
    id: "a2",
    level: "A2",
    title: "Elementary",
    description: "Consolidação do básico",
    progress: 0,
    modules: [
      {
        id: "a2-m1",
        title: "Shopping Basics",
        description: "Compras, tamanhos e preços",
        lessons: 7,
        completedLessons: 0,
        locked: true,
        color: "from-primary to-accent",
      },
      {
        id: "a2-m2",
        title: "Health & Wellness",
        description: "Sintomas e cuidados simples",
        lessons: 6,
        completedLessons: 0,
        locked: true,
        color: "from-secondary to-primary",
      },
      {
        id: "a2-m3",
        title: "Travel Essentials",
        description: "Hotel, transporte e aeroporto",
        lessons: 8,
        completedLessons: 0,
        locked: true,
        color: "from-accent to-secondary",
      },
      {
        id: "a2-m4",
        title: "Work & Study",
        description: "Ingles para rotina de trabalho e estudos",
        lessons: 7,
        completedLessons: 0,
        locked: true,
        color: "from-neon-green to-secondary",
      },
      {
        id: "a2-m5",
        title: "Past Tense Basics",
        description: "Falando do passado com clareza",
        lessons: 6,
        completedLessons: 0,
        locked: true,
        color: "from-primary to-secondary",
      },
    ],
  },
  {
    id: "b1",
    level: "B1",
    title: "Intermediate",
    description: "Fluidez em situações reais",
    progress: 0,
    modules: [
      {
        id: "b1-m1",
        title: "Hobbies & Interests",
        description: "Converse sobre interesses pessoais",
        lessons: 7,
        completedLessons: 0,
        locked: true,
        color: "from-primary to-accent",
      },
      {
        id: "b1-m2",
        title: "Experiences & Stories",
        description: "Conte historias e experiências",
        lessons: 8,
        completedLessons: 0,
        locked: true,
        color: "from-secondary to-primary",
      },
      {
        id: "b1-m3",
        title: "Future Plans",
        description: "Planos, metas e possibilidades",
        lessons: 6,
        completedLessons: 0,
        locked: true,
        color: "from-accent to-secondary",
      },
      {
        id: "b1-m4",
        title: "Opinions & Media",
        description: "Filmes, noticias e preferências",
        lessons: 7,
        completedLessons: 0,
        locked: true,
        color: "from-neon-green to-secondary",
      },
      {
        id: "b1-m5",
        title: "Problem Solving",
        description: "Lidar com problemas do cotidiano",
        lessons: 6,
        completedLessons: 0,
        locked: true,
        color: "from-primary to-secondary",
      },
    ],
  },
  {
    id: "b2",
    level: "B2",
    title: "Upper Intermediate",
    description: "Confianca para conversas complexas",
    progress: 0,
    modules: [
      {
        id: "b2-m1",
        title: "Debates & Arguments",
        description: "Estruture opinioes com clareza",
        lessons: 8,
        completedLessons: 0,
        locked: true,
        color: "from-primary to-accent",
      },
      {
        id: "b2-m2",
        title: "Professional English",
        description: "Reunioes, emails e negociacoes",
        lessons: 9,
        completedLessons: 0,
        locked: true,
        color: "from-secondary to-primary",
      },
      {
        id: "b2-m3",
        title: "Idioms & Phrasal Verbs",
        description: "Expressoes comuns no dia a dia",
        lessons: 10,
        completedLessons: 0,
        locked: true,
        color: "from-accent to-secondary",
      },
      {
        id: "b2-m4",
        title: "Complex Narratives",
        description: "Conte historias com detalhes",
        lessons: 7,
        completedLessons: 0,
        locked: true,
        color: "from-neon-green to-secondary",
      },
      {
        id: "b2-m5",
        title: "Presentations",
        description: "Apresentacoes com impacto",
        lessons: 6,
        completedLessons: 0,
        locked: true,
        color: "from-primary to-secondary",
      },
    ],
  },
  {
    id: "c1",
    level: "C1",
    title: "Advanced",
    description: "Domine nuances e contexto",
    progress: 0,
    modules: [
      {
        id: "c1-m1",
        title: "Academic Writing",
        description: "Textos formais e argumentativos",
        lessons: 8,
        completedLessons: 0,
        locked: true,
        color: "from-primary to-accent",
      },
      {
        id: "c1-m2",
        title: "Advanced Listening",
        description: "Conteudos rapidos e detalhes",
        lessons: 9,
        completedLessons: 0,
        locked: true,
        color: "from-secondary to-primary",
      },
      {
        id: "c1-m3",
        title: "Negotiation & Persuasion",
        description: "Conversas estrategicas e persuasivas",
        lessons: 8,
        completedLessons: 0,
        locked: true,
        color: "from-accent to-secondary",
      },
      {
        id: "c1-m4",
        title: "Cultural Nuance",
        description: "Contexto cultural e naturalidade",
        lessons: 7,
        completedLessons: 0,
        locked: true,
        color: "from-neon-green to-secondary",
      },
    ],
  },
  {
    id: "c2",
    level: "C2",
    title: "Proficiency",
    description: "Precicao e fluidez total",
    progress: 0,
    modules: [
      {
        id: "c2-m1",
        title: "Mastery & Precision",
        description: "Vocabulario e gramatica de alto nivel",
        lessons: 9,
        completedLessons: 0,
        locked: true,
        color: "from-primary to-accent",
      },
      {
        id: "c2-m2",
        title: "Advanced Pronunciation",
        description: "Entonacao, ritmo e clareza",
        lessons: 8,
        completedLessons: 0,
        locked: true,
        color: "from-secondary to-primary",
      },
      {
        id: "c2-m3",
        title: "Technical Discussions",
        description: "Assuntos tecnicos e especificos",
        lessons: 8,
        completedLessons: 0,
        locked: true,
        color: "from-accent to-secondary",
      },
      {
        id: "c2-m4",
        title: "Exam Readiness",
        description: "Simulados e estrategias de prova",
        lessons: 7,
        completedLessons: 0,
        locked: true,
        color: "from-neon-green to-secondary",
      },
    ],
  },
];

const Courses = () => {
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
            Trilhas de <span className="gradient-text">Aprendizado</span>
          </h1>
          <p className="text-muted-foreground">
            Siga o caminho do zero à fluência
          </p>
        </motion.div>

        <div className="space-y-8">
          {courses.map((course, courseIndex) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: courseIndex * 0.1 }}
            >
              {/* Course Header */}
              <div className="glass-card p-6 mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="font-display font-bold text-xl text-primary-foreground">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-display font-bold">
                      {course.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-display font-bold text-primary">
                      {course.progress}%
                    </p>
                    <p className="text-xs text-muted-foreground">completo</p>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* Modules */}
              <div className="space-y-3 pl-4 border-l-2 border-border ml-6">
                {course.modules.map((module, moduleIndex) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: courseIndex * 0.1 + moduleIndex * 0.05 }}
                  >
                    <Link
                      to={module.locked ? "#" : `/module/${module.id}`}
                      className={module.locked ? "cursor-not-allowed" : ""}
                    >
                      <div
                        className={`glass-card p-4 card-hover flex items-center gap-4 relative ${
                          module.locked ? "opacity-50" : ""
                        }`}
                      >
                        {/* Connection dot */}
                        <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-primary border-2 border-background" />

                        {/* Module icon */}
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center`}
                        >
                          {module.locked ? (
                            <Lock className="w-5 h-5 text-primary-foreground" />
                          ) : module.completedLessons === module.lessons ? (
                            <CheckCircle className="w-5 h-5 text-primary-foreground" />
                          ) : (
                            <Play className="w-5 h-5 text-primary-foreground" />
                          )}
                        </div>

                        {/* Module info */}
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {module.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {module.completedLessons}/{module.lessons} lições
                            </span>
                            {module.completedLessons === module.lessons && (
                              <div className="flex items-center gap-1 text-neon-green text-xs">
                                <Star className="w-3 h-3" />
                                Completo
                              </div>
                            )}
                          </div>
                          {module.completedLessons > 0 &&
                            module.completedLessons < module.lessons && (
                              <div className="progress-bar mt-2">
                                <div
                                  className="progress-bar-fill"
                                  style={{
                                    width: `${(module.completedLessons / module.lessons) * 100}%`,
                                  }}
                                />
                              </div>
                            )}
                        </div>

                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Courses;

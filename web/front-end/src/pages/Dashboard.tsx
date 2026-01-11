import { motion } from "framer-motion";
import { 
  Flame, 
  Zap, 
  Target, 
  Trophy,
  BookOpen,
  Clock,
  TrendingUp,
  ChevronRight,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { mockProgress } from "@/data/mockProgress";
import { reviewWordBank } from "@/data/reviewWordBank";
import { useFeatures } from "@/hooks/useFeatures";

const Dashboard = () => {
  const { user } = useAuth();
  const { isEnabled } = useFeatures();

  // Mock data - will be replaced with real data from database
  const stats = mockProgress;
  const pendingReviewCount = Math.min(reviewWordBank.length, stats.lessonsCompleted * 20);

  const recentLessons: Array<{
    id: number;
    title: string;
    module: string;
    progress: number;
    xp: number;
  }> = [];

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Aluno";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 md:pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Olá, <span className="gradient-text">{userName}</span>! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue de onde parou e mantenha seu streak!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {/* Streak */}
          <div className="glass-card p-4 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{stats.streak}</p>
                <p className="text-xs text-muted-foreground">dias de streak</p>
              </div>
            </div>
          </div>

          {/* XP */}
          <div className="glass-card p-4 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{stats.xp}</p>
                <p className="text-xs text-muted-foreground">XP total</p>
              </div>
            </div>
          </div>

          {/* Level */}
          <div className="glass-card p-4 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Trophy className="w-5 h-5 text-background" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{stats.level}</p>
                <p className="text-xs text-muted-foreground">Nível atual</p>
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="glass-card p-4 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green to-secondary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-background" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{stats.lessonsCompleted}</p>
                <p className="text-xs text-muted-foreground">lições feitas</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Goal & Weekly Progress */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Daily Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Meta diária
              </h3>
              <span className="text-sm text-muted-foreground">
                {stats.todayMinutes}/{stats.dailyGoalMinutes} min
              </span>
            </div>
            <div className="progress-bar mb-2">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(100, (stats.todayMinutes / stats.dailyGoalMinutes) * 100)}%`,
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Faltam {Math.max(0, stats.dailyGoalMinutes - stats.todayMinutes)} minutos para completar
            </p>
          </motion.div>

          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Progresso semanal
              </h3>
              <span className="text-sm text-muted-foreground">
                {stats.weeklyGoal}%
              </span>
            </div>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div
                key={day}
                className={`flex-1 h-8 rounded ${
                    day <= Math.round((stats.weeklyGoal / 100) * 7)
                      ? "bg-gradient-to-t from-primary to-secondary"
                      : "bg-muted"
                  }`}
              />
            ))}
          </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
              <span>Dom</span>
            </div>
          </motion.div>
        </div>

        {/* Continue Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold">
              Continue aprendendo
            </h2>
            {isEnabled("courses") && (
              <Link to="/courses">
                <Button variant="ghost" size="sm">
                  Ver todas <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>

          {recentLessons.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Você ainda não iniciou nenhuma lição.
              </p>
              {isEnabled("courses") && (
                <Link to="/courses">
                  <Button variant="glow">Começar minha primeira lição</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {recentLessons.map((lesson, index) => (
                <Link key={lesson.id} to={`/lesson/${lesson.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="glass-card p-4 card-hover flex items-center gap-4"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        lesson.progress === 100
                          ? "bg-neon-green/20 text-neon-green"
                          : lesson.progress > 0
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {lesson.progress === 100 ? (
                        <Trophy className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{lesson.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {lesson.module}
                        </span>
                        <span className="text-xs text-primary">+{lesson.xp} XP</span>
                      </div>
                      {lesson.progress > 0 && lesson.progress < 100 && (
                        <div className="progress-bar mt-2">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${lesson.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 gap-4"
        >
          {isEnabled("review") && (
            <Link to="/review">
              <div className="glass-card p-4 card-hover text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-accent" />
                <h3 className="font-medium">Revisão</h3>
                <p className="text-xs text-muted-foreground">
                  {pendingReviewCount} palavras pendentes
                </p>
              </div>
            </Link>
          )}
          {isEnabled("courses") && (
            <Link to="/courses">
              <div className="glass-card p-4 card-hover text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <h3 className="font-medium">Trilhas</h3>
                <p className="text-xs text-muted-foreground">Explorar módulos</p>
              </div>
            </Link>
          )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;

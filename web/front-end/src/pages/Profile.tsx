import { useState } from "react";
import { motion } from "framer-motion";
import { User, Settings, Clock, Target, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { mockProgress } from "@/data/mockProgress";

const dailyTimeOptions = [
  { value: 10, label: "10 min", description: "Leve" },
  { value: 15, label: "15 min", description: "Constante" },
  { value: 20, label: "20 min", description: "Focado" },
  { value: 30, label: "30 min", description: "Acelerado" },
];

const avatarOptions = [
  { id: "neo", label: "Neo", color: "from-primary to-accent", initials: "N" },
  { id: "luna", label: "Luna", color: "from-secondary to-primary", initials: "L" },
  { id: "iris", label: "Iris", color: "from-accent to-secondary", initials: "I" },
  { id: "kai", label: "Kai", color: "from-neon-green to-secondary", initials: "K" },
  { id: "sol", label: "Sol", color: "from-primary to-neon-green", initials: "S" },
  { id: "vale", label: "Vale", color: "from-secondary to-accent", initials: "V" },
];

const focusOptions = [
  { id: "conversa", label: "Conversação" },
  { id: "trabalho", label: "Trabalho" },
  { id: "viagem", label: "Viagem" },
  { id: "provas", label: "Provas" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [dailyTime, setDailyTime] = useState(mockProgress.dailyGoalMinutes);
  const [avatarId, setAvatarId] = useState("neo");
  const [focus, setFocus] = useState("conversa");

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Até logo!",
      description: "Você saiu da sua conta.",
    });
    navigate("/");
  };

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências foram atualizadas.",
    });
  };

  const userName = user?.user_metadata?.full_name || "Usuário";
  const userEmail = user?.email || "";
  const userLevel = mockProgress.level;
  const userXp = mockProgress.xp;
  const userStreak = mockProgress.streak;
  const selectedAvatar = avatarOptions.find((option) => option.id === avatarId) ?? avatarOptions[0];

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
            Meu <span className="gradient-text">Perfil</span>
          </h1>
          <p className="text-muted-foreground">
            Gerencie sua conta e preferências
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedAvatar.color} flex items-center justify-center`}
            >
              <span className="font-display font-bold text-primary-foreground text-xl">
                {selectedAvatar.initials}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-display font-bold">{userName}</h2>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-display font-bold text-primary">
              {userLevel}
            </p>
            <p className="text-xs text-muted-foreground">Nível</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-display font-bold text-secondary">
              {userXp}
            </p>
            <p className="text-xs text-muted-foreground">XP Total</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-display font-bold text-accent">
              {userStreak}
            </p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-display font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            Configurações
          </h3>

          {/* Avatar */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <div>
                <Label className="font-medium">Avatar</Label>
                <p className="text-sm text-muted-foreground">
                  Escolha um bonequinho para o seu perfil
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {avatarOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setAvatarId(option.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    avatarId === option.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center mx-auto`}
                  >
                    <span className="font-display font-bold text-primary-foreground">
                      {option.initials}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Focus */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-secondary" />
              <div>
                <Label className="font-medium">Foco de estudo</Label>
                <p className="text-sm text-muted-foreground">
                  Ajuste o tipo de conteudo que aparece primeiro
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {focusOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFocus(option.id)}
                  className={`p-3 rounded-xl border text-sm transition-all ${
                    focus === option.id
                      ? "border-secondary bg-secondary/10 text-foreground"
                      : "border-border bg-card hover:border-secondary/50 text-muted-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Goal */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <Label className="font-medium">Meta diária</Label>
                <p className="text-sm text-muted-foreground">
                  Quanto tempo você quer estudar por dia?
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {dailyTimeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDailyTime(option.value)}
                  className={`p-3 rounded-xl border transition-all ${
                    dailyTime === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Goal */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-secondary" />
              <div>
                <p className="font-medium">Objetivo de aprendizado</p>
                <p className="text-sm text-muted-foreground">Fluência total</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <Button variant="glow" className="w-full" onClick={handleSaveSettings}>
            Salvar Configurações
          </Button>

          {/* Logout */}
          <Button
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da conta
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;

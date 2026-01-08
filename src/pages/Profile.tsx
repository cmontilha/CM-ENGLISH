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

const dailyTimeOptions = [
  { value: 5, label: "5 min", description: "Casual" },
  { value: 10, label: "10 min", description: "Regular" },
  { value: 15, label: "15 min", description: "Sério" },
  { value: 20, label: "20 min", description: "Intensivo" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [dailyTime, setDailyTime] = useState(10);

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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
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
            <p className="text-2xl font-display font-bold text-primary">A1</p>
            <p className="text-xs text-muted-foreground">Nível</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-display font-bold text-secondary">1.2k</p>
            <p className="text-xs text-muted-foreground">XP Total</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-display font-bold text-accent">5</p>
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

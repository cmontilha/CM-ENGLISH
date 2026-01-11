import { Home, BookOpen, RotateCcw, User, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFeatures } from "@/hooks/useFeatures";

const navItems = [
  { icon: Home, label: "Início", path: "/dashboard" },
  { icon: BookOpen, label: "Trilhas", path: "/courses" },
  { icon: Trophy, label: "XP", path: "/leaderboard" },
  { icon: RotateCcw, label: "Revisão", path: "/review" },
  { icon: User, label: "Perfil", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const { isEnabled } = useFeatures();
  const visibleItems = navItems.filter((item) => {
    if (item.path === "/courses") return isEnabled("courses");
    if (item.path === "/review") return isEnabled("review");
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-card border-t border-border/30 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-16 h-full"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs mt-1 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;

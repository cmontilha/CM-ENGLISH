import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import { useFeatures } from "@/hooks/useFeatures";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, role } = useAuth();
  const { isEnabled } = useFeatures();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? "/dashboard" : "/"}>
            <Logo size="sm" animated={false} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                {isEnabled("courses") && (
                  <Link to="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                    Trilhas
                  </Link>
                )}
                {isEnabled("review") && (
                  <Link to="/review" className="text-muted-foreground hover:text-foreground transition-colors">
                    Revisão
                  </Link>
                )}
                {role === "tutor" && isEnabled("tutor_tools") && (
                  <Link to="/tutor/classes" className="text-muted-foreground hover:text-foreground transition-colors">
                    Turmas
                  </Link>
                )}
                {role === "admin_master" && (
                  <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <Link to="/profile">
                    <Button variant="ghost" size="icon">
                      <User className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/auth?mode=login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button variant="glow">Começar Grátis</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border/30"
          >
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {isEnabled("courses") && (
                    <Link
                      to="/courses"
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Trilhas
                    </Link>
                  )}
                  {isEnabled("review") && (
                    <Link
                      to="/review"
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Revisão
                    </Link>
                  )}
                  {role === "tutor" && isEnabled("tutor_tools") && (
                    <Link
                      to="/tutor/classes"
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Turmas
                    </Link>
                  )}
                  {role === "admin_master" && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Perfil
                  </Link>
                  <Button variant="outline" onClick={handleSignOut} className="mx-4">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth?mode=login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start px-4">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/auth?mode=register" onClick={() => setIsOpen(false)}>
                    <Button variant="glow" className="mx-4">
                      Começar Grátis
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

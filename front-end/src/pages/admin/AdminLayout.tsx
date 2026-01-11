import { Link, Outlet, useLocation } from "react-router-dom";
import { BarChart3, Users, Layers, Shield, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const navItems = [
  { label: "Visao geral", path: "/admin", icon: BarChart3 },
  { label: "Usuarios", path: "/admin/users", icon: Users },
  { label: "Cursos", path: "/admin/courses", icon: Layers },
  { label: "Permissoes", path: "/admin/features", icon: Shield },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row">
        <aside className="md:w-64 border-b md:border-b-0 md:border-r border-border/60 glass-card rounded-none md:rounded-r-xl">
          <div className="p-4 flex items-center justify-between md:justify-start md:gap-2">
            <Logo size="sm" animated={false} />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Admin</span>
          </div>
          <nav className="px-4 pb-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-primary/15 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
          <div className="px-4 pb-6">
            <Link to="/dashboard">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao app
              </Button>
            </Link>
          </div>
        </aside>

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

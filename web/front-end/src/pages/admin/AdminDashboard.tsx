import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Shield, Layers, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

interface FeatureRow {
  key: string;
  label: string | null;
  is_enabled: boolean | null;
}

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [features, setFeatures] = useState<FeatureRow[]>([]);
  const [coursesCount, setCoursesCount] = useState(0);
  const [classesCount, setClassesCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [tutors, setTutors] = useState(0);
  const [students, setStudents] = useState(0);
  const [admins, setAdmins] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [recentLogins, setRecentLogins] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const [{ data: profileData }, { data: featureData }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, email, role, is_active, created_at")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase.from("features").select("key, label, is_enabled").order("key"),
      ]);

      const { count: courseCount } = await supabase
        .from("courses")
        .select("id", { count: "exact", head: true });

      const { count: classCount } = await supabase
        .from("classes")
        .select("id", { count: "exact", head: true });

      const { count: totalCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      const { count: tutorCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "tutor");

      const { count: studentCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "student");

      const { count: adminCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin_master");

      const { count: activeCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { count: loginCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("last_login_at", thirtyDaysAgo.toISOString());

      setProfiles(profileData ?? []);
      setFeatures(featureData ?? []);
      setCoursesCount(courseCount ?? 0);
      setClassesCount(classCount ?? 0);
      setTotalUsers(totalCount ?? 0);
      setTutors(tutorCount ?? 0);
      setStudents(studentCount ?? 0);
      setAdmins(adminCount ?? 0);
      setActiveUsers(activeCount ?? 0);
      setRecentLogins(loginCount ?? 0);
    };

    loadData();
  }, []);

  const chartData = useMemo(() => {
    const buckets: Record<string, number> = {};
    profiles.forEach((profile) => {
      if (!profile.created_at) return;
      const date = new Date(profile.created_at);
      const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      buckets[label] = (buckets[label] ?? 0) + 1;
    });

    return Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, total]) => ({ month, total }));
  }, [profiles]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
          Painel <span className="gradient-text">Administrativo</span>
        </h1>
        <p className="text-muted-foreground">
          Visao geral do CM English com dados de usuarios, cursos e recursos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{totalUsers}</p>
              <p className="text-xs text-muted-foreground">Usuarios cadastrados</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{admins}</p>
              <p className="text-xs text-muted-foreground">Admins Master</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{coursesCount}</p>
              <p className="text-xs text-muted-foreground">Cursos criados</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{activeUsers}</p>
              <p className="text-xs text-muted-foreground">Usuarios ativos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold mb-4">Cadastro por mes</h2>
          <div className="h-60">
            {chartData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados para exibir.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold mb-4">Resumo de roles</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tutores</span>
              <span className="font-semibold text-foreground">{tutors}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Alunos</span>
              <span className="font-semibold text-foreground">{students}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Turmas</span>
              <span className="font-semibold text-foreground">{classesCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Logins (30 dias)</span>
              <span className="font-semibold text-foreground">{recentLogins}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Inativos</span>
              <span className="font-semibold text-foreground">
                {Math.max(0, totalUsers - activeUsers)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Recursos ativos</span>
              <span className="font-semibold text-foreground">
                {features.filter((feature) => feature.is_enabled).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold mb-4">Usuarios recentes</h2>
          <div className="space-y-3 text-sm">
            {profiles.slice(0, 6).map((profile) => (
              <div key={profile.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {profile.full_name || "Sem nome"}
                  </p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                </div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {profile.role}
                </span>
              </div>
            ))}
            {profiles.length === 0 && (
              <p className="text-muted-foreground">Nenhum usuario cadastrado.</p>
            )}
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold mb-4">Recursos ativos</h2>
          <div className="space-y-3 text-sm">
            {features.map((feature) => (
              <div key={feature.key} className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {feature.label || feature.key}
                </span>
                <span className={feature.is_enabled ? "text-neon-green" : "text-destructive"}>
                  {feature.is_enabled ? "Ativo" : "Inativo"}
                </span>
              </div>
            ))}
            {features.length === 0 && (
              <p className="text-muted-foreground">Nenhum recurso cadastrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

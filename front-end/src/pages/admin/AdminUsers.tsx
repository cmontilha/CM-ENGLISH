import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfiles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, is_active, created_at")
      .order("created_at", { ascending: false });

    setProfiles(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleToggleActive = async (profile: ProfileRow) => {
    await supabase
      .from("profiles")
      .update({ is_active: !profile.is_active })
      .eq("id", profile.id);

    loadProfiles();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">Usuarios</h1>
        <p className="text-muted-foreground">
          Controle de roles, status e visao geral dos cadastros.
        </p>
      </div>

      <div className="glass-card p-6">
        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : profiles.length === 0 ? (
          <p className="text-muted-foreground">Nenhum usuario encontrado.</p>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-border/40 pb-4"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {profile.full_name || "Sem nome"}
                  </p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                </div>
                <div className="flex items-center gap-4 text-xs uppercase tracking-wider text-muted-foreground">
                  <span>{profile.role}</span>
                  <span>{profile.is_active ? "Ativo" : "Inativo"}</span>
                </div>
                <Button variant="outline" onClick={() => handleToggleActive(profile)}>
                  {profile.is_active ? "Desativar" : "Ativar"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

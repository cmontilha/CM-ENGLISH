import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface FeatureRow {
  key: string;
  label: string | null;
  is_enabled: boolean | null;
}

const AdminFeatures = () => {
  const [features, setFeatures] = useState<FeatureRow[]>([]);

  const loadFeatures = async () => {
    const { data } = await supabase
      .from("features")
      .select("key, label, is_enabled")
      .order("key");
    setFeatures(data ?? []);
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const handleToggle = async (feature: FeatureRow) => {
    await supabase
      .from("features")
      .update({ is_enabled: !feature.is_enabled })
      .eq("key", feature.key);

    loadFeatures();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">Permissoes e recursos</h1>
        <p className="text-muted-foreground">
          Ative ou desative modulos globais da plataforma em tempo real.
        </p>
      </div>

      <div className="glass-card p-6">
        {features.length === 0 ? (
          <p className="text-muted-foreground">Nenhum recurso cadastrado.</p>
        ) : (
          <div className="space-y-4">
            {features.map((feature) => (
              <div
                key={feature.key}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-border/40 pb-4"
              >
                <div>
                  <p className="font-medium text-foreground">{feature.label || feature.key}</p>
                  <p className="text-xs text-muted-foreground">{feature.key}</p>
                </div>
                <Button variant="outline" onClick={() => handleToggle(feature)}>
                  {feature.is_enabled ? "Desativar" : "Ativar"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeatures;

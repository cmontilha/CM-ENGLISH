import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FeatureRow {
  key: string;
  label: string | null;
  is_enabled: boolean | null;
}

interface FeatureContextValue {
  features: FeatureRow[];
  isEnabled: (key: string) => boolean;
}

const FeatureContext = createContext<FeatureContextValue | undefined>(undefined);

export const FeatureProvider = ({ children }: { children: React.ReactNode }) => {
  const [features, setFeatures] = useState<FeatureRow[]>([]);

  useEffect(() => {
    const loadFeatures = async () => {
      const { data } = await supabase
        .from("features")
        .select("key, label, is_enabled")
        .order("key");

      setFeatures(data ?? []);
    };

    loadFeatures();

    const channel = supabase
      .channel("features_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "features" },
        () => {
          loadFeatures();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const isEnabled = useMemo(() => {
    return (key: string) => {
      const match = features.find((feature) => feature.key === key);
      if (!match) return true;
      return !!match.is_enabled;
    };
  }, [features]);

  return (
    <FeatureContext.Provider value={{ features, isEnabled }}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatures = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeatures must be used within a FeatureProvider");
  }
  return context;
};

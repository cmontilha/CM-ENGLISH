import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

interface ScreenProps {
  children: ReactNode;
}

const Screen = ({ children }: ScreenProps) => {
  return (
    <LinearGradient
      colors={[
        colors.background,
        "hsla(286, 94%, 60%, 0.15)",
        "hsla(300, 86%, 62%, 0.2)",
        colors.backgroundDeep,
      ]}
      style={styles.gradient}
    >
      <View style={styles.overlay} />
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "hsla(286, 94%, 60%, 0.08)",
  },
});

export default Screen;

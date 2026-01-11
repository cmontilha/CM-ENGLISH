import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  icon?: ReactNode;
  variant?: "solid" | "outline";
}

const PrimaryButton = ({ label, onPress, icon, variant = "solid" }: PrimaryButtonProps) => {
  const isOutline = variant === "outline";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isOutline && styles.outline,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {icon}
        <Text style={[styles.text, isOutline && styles.outlineText]}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 6,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
    shadowOpacity: 0,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  outlineText: {
    color: colors.primary,
  },
});

export default PrimaryButton;

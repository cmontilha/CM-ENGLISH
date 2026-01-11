import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Screen from "../components/Screen";
import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/colors";
import BackButton from "../components/BackButton";

interface AuthScreenProps {
  onSuccess: () => void;
}

const AuthScreen = ({ onSuccess }: AuthScreenProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"student" | "tutor">("student");

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <BackButton />
        <Logo size={200} />
        <Text style={styles.title}>
          {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
        </Text>
        <Text style={styles.subtitle}>
          {mode === "login" ? "Entre para continuar" : "Comece sua jornada rumo a fluencia"}
        </Text>

        {mode === "register" && (
          <View style={styles.roleRow}>
            <PrimaryButton
              label="Aluno"
              onPress={() => setRole("student")}
              variant={role === "student" ? "solid" : "outline"}
            />
            <PrimaryButton
              label="Tutor"
              onPress={() => setRole("tutor")}
              variant={role === "tutor" ? "solid" : "outline"}
            />
          </View>
        )}

        <View style={styles.form}>
          {mode === "register" && (
            <TextInput placeholder="Nome completo" style={styles.input} placeholderTextColor={colors.mutedText} />
          )}
          <TextInput placeholder="Email" style={styles.input} placeholderTextColor={colors.mutedText} />
          <TextInput placeholder="Senha" secureTextEntry style={styles.input} placeholderTextColor={colors.mutedText} />
          {mode === "register" && (
            <TextInput
              placeholder="Confirmar senha"
              secureTextEntry
              style={styles.input}
              placeholderTextColor={colors.mutedText}
            />
          )}
        </View>

        <PrimaryButton label={mode === "login" ? "Entrar" : "Criar conta"} onPress={onSuccess} />

        <Text style={styles.toggle} onPress={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Ainda nao tem conta? Criar conta" : "Ja tem uma conta? Entrar"}
        </Text>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 60,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.mutedText,
    textAlign: "center",
  },
  roleRow: {
    flexDirection: "row",
    gap: 12,
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: colors.text,
  },
  toggle: {
    textAlign: "center",
    color: colors.primary,
    fontWeight: "600",
  },
});

export default AuthScreen;

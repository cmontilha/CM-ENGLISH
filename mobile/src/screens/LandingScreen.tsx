import { ScrollView, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/colors";

interface LandingScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

const LandingScreen = ({ onLogin, onRegister }: LandingScreenProps) => {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Logo size={200} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>+10.000 alunos ativos</Text>
        </View>

        <Text style={styles.title}>
          Aprenda Ingles para a{"\n"}
          <Text style={styles.gradientText}>Vida Real</Text>
        </Text>
        <Text style={styles.subtitle}>
          Trilhas personalizadas, exercicios gamificados e revisao inteligente. Do zero a fluencia no seu ritmo.
        </Text>

        <View style={styles.actions}>
          <PrimaryButton label="Comecar Gratis" onPress={onRegister} />
          <PrimaryButton label="Ja tenho conta" onPress={onLogin} variant="outline" />
        </View>

      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 60,
    alignItems: "center",
  },
  badge: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "hsla(286, 94%, 60%, 0.2)",
    borderWidth: 1,
    borderColor: "hsla(286, 94%, 60%, 0.5)",
  },
  badgeText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginTop: 24,
    lineHeight: 40,
  },
  gradientText: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedText,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 22,
  },
  actions: {
    width: "100%",
    gap: 12,
    marginTop: 28,
  },
});

export default LandingScreen;

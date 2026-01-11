import { ScrollView, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { colors } from "../theme/colors";

const modules = [
  { title: "A0 - Absolute Beginner", subtitle: "Primeiro contato com o ingles" },
  { title: "A1 - Beginner", subtitle: "Fundamentos essenciais" },
  { title: "A2 - Elementary", subtitle: "Consolidacao do basico" },
  { title: "B1 - Intermediate", subtitle: "Fluidez em situacoes reais" },
];

const CoursesScreen = () => {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Trilhas de Aprendizado</Text>
        <Text style={styles.subtitle}>Siga o caminho do zero a fluencia.</Text>

        <View style={styles.list}>
          {modules.map((module) => (
            <View key={module.title} style={styles.card}>
              <Text style={styles.cardTitle}>{module.title}</Text>
              <Text style={styles.cardText}>{module.subtitle}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 72,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mutedText,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  cardText: {
    marginTop: 6,
    color: colors.mutedText,
  },
});

export default CoursesScreen;

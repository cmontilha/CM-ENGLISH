import { ScrollView, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import BackButton from "../components/BackButton";
import { colors } from "../theme/colors";

const TutorClassesScreen = () => {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <BackButton />
        <Text style={styles.title}>Turmas</Text>
        <Text style={styles.subtitle}>Organize alunos e conteudos por sala.</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nenhuma turma criada</Text>
          <Text style={styles.cardText}>Crie sua primeira turma para começar.</Text>
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  cardText: {
    marginTop: 6,
    color: colors.mutedText,
  },
});

export default TutorClassesScreen;

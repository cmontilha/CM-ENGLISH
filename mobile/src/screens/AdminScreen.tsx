import { ScrollView, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import BackButton from "../components/BackButton";
import { colors } from "../theme/colors";

const AdminScreen = () => {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <BackButton />
        <Text style={styles.title}>Painel Administrativo</Text>
        <Text style={styles.subtitle}>Resumo de usuarios, cursos e recursos.</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Metricas principais</Text>
          <Text style={styles.cardText}>Conecte com o banco para dados reais.</Text>
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

export default AdminScreen;

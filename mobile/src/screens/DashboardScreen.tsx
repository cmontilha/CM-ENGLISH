import { ScrollView, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { colors } from "../theme/colors";

const stats = [
  { label: "Streak", value: "0 dias" },
  { label: "XP", value: "0" },
  { label: "Nivel", value: "A0" },
  { label: "Licoes", value: "0" },
];

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const progressDays = [20, 35, 10, 50, 60, 15, 5];

const DashboardScreen = () => {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Seu progresso em tempo real.</Text>

        <View style={styles.grid}>
          {stats.map((item) => (
            <View key={item.label} style={styles.card}>
              <Text style={styles.cardValue}>{item.value}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progresso semanal</Text>
          <View style={styles.chart}>
            {progressDays.map((value, index) => (
              <View key={index} style={styles.chartColumn}>
                <View style={[styles.chartBar, { height: `${value}%` }]} />
                <Text style={styles.chartLabel}>{weekDays[index]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue aprendendo</Text>
          <View style={styles.bigCard}>
            <Text style={styles.bigCardTitle}>Voce ainda nao iniciou nenhuma licao.</Text>
            <Text style={styles.bigCardText}>Escolha uma trilha para comecar.</Text>
          </View>
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
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mutedText,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.mutedText,
    marginTop: 4,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 160,
  },
  chartColumn: {
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  chartBar: {
    width: 12,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  chartLabel: {
    fontSize: 10,
    color: colors.mutedText,
  },
  bigCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  bigCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  bigCardText: {
    marginTop: 6,
    color: colors.mutedText,
  },
});

export default DashboardScreen;

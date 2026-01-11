import { ScrollView, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { colors } from "../theme/colors";

const ReviewScreen = () => {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Revisao Inteligente</Text>
        <Text style={styles.subtitle}>Suas palavras aparecem aqui conforme voce avanca.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nenhuma palavra para revisar</Text>
          <Text style={styles.cardText}>Complete lições para liberar revisoes.</Text>
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
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  cardText: {
    marginTop: 6,
    color: colors.mutedText,
  },
});

export default ReviewScreen;

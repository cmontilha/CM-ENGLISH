import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Screen from "../components/Screen";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../theme/colors";

const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Gerencie sua conta e preferências.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meta diaria</Text>
          <Text style={styles.cardText}>10 minutos</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Foco de estudo</Text>
          <Text style={styles.cardText}>Conversacao</Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Salvar configuracoes" onPress={() => {}} />
          <PrimaryButton label="Painel Admin" onPress={() => navigation.navigate("Admin" as never)} variant="outline" />
          <PrimaryButton label="Turmas do Tutor" onPress={() => navigation.navigate("TutorClasses" as never)} variant="outline" />
          <PrimaryButton label="Sair" onPress={() => {}} variant="outline" />
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
  actions: {
    gap: 12,
    marginTop: 8,
  },
});

export default ProfileScreen;

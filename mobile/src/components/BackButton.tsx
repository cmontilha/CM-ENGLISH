import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <Pressable style={styles.button} onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={24} color={colors.text} />
      <Text style={styles.text}>Voltar</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingVertical: 6,
  },
  text: {
    color: colors.text,
    fontWeight: "600",
  },
});

export default BackButton;

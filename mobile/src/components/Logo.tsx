import { Image, StyleSheet } from "react-native";

interface LogoProps {
  size?: number;
}

const Logo = ({ size = 140 }: LogoProps) => {
  return (
    <Image
      source={require("../../assets/logo.png")}
      style={[styles.logo, { width: size, height: size }]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
  },
});

export default Logo;

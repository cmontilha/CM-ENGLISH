import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import LandingScreen from "./src/screens/LandingScreen";
import AuthScreen from "./src/screens/AuthScreen";
import MainTabs from "./src/navigation/MainTabs";
import AdminScreen from "./src/screens/AdminScreen";
import TutorClassesScreen from "./src/screens/TutorClassesScreen";
import { colors } from "./src/theme/colors";
import Logo from "./src/components/Logo";

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
  },
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="dark" />
      {showSplash ? (
        <LinearGradient
          colors={[
            "hsla(286, 94%, 60%, 0.95)",
            "hsla(300, 86%, 62%, 0.9)",
            "hsla(322, 80%, 62%, 0.92)",
          ]}
          style={styles.splash}
        >
          <Logo size={320} />
        </LinearGradient>
      ) : (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Landing">
              {(props) => (
                <LandingScreen
                  {...props}
                  onLogin={() => props.navigation.navigate("Auth")}
                  onRegister={() => props.navigation.navigate("Auth")}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Auth">
              {(props) => (
                <AuthScreen
                  {...props}
                  onSuccess={() => {
                    setIsAuthenticated(true);
                    props.navigation.replace("Main");
                  }}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Admin" component={AdminScreen} />
            <Stack.Screen name="TutorClasses" component={TutorClassesScreen} />
          </>
        )}
      </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});

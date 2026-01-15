import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "../screens/DashboardScreen";
import CoursesScreen from "../screens/CoursesScreen";
import ReviewScreen from "../screens/ReviewScreen";
import ProfileScreen from "../screens/ProfileScreen";
import VoiceChatScreen from "../screens/VoiceChatScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "hsla(280, 50%, 98%, 0.9)",
          borderTopColor: "hsla(280, 24%, 86%, 0.6)",
          height: 68,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: focused ? "home" : "home-outline",
            Trilhas: focused ? "book" : "book-outline",
            Revisao: focused ? "repeat" : "repeat-outline",
            Voice: focused ? "mic" : "mic-outline",
            Perfil: focused ? "person" : "person-outline",
          };

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Trilhas" component={CoursesScreen} />
      <Tab.Screen name="Voice" component={VoiceChatScreen} />
      <Tab.Screen name="Revisao" component={ReviewScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;

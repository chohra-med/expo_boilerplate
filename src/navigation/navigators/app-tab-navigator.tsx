import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type React from "react";
import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { HomeScreen } from "#root/features/home";
import { SettingsNavigator } from "#root/features/settings";
import { useTheme } from "#root/ui/style/theme-provider";
import type { AppTabStackParamsList } from "../routes";

const Tab = createBottomTabNavigator<AppTabStackParamsList>();

const TodoScreen = lazy(async () => {
  const { TodosScreen } = await import("#root/features/todos/screens/todos-screen");
  return { default: TodosScreen };
});
export const AppTabNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Todos") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("navigation.home"),
        }}
      />
      <Tab.Screen
        name="Todos"
        component={TodoScreen}
        options={{
          title: t("navigation.todos"),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: t("navigation.settings"),
        }}
      />
    </Tab.Navigator>
  );
};

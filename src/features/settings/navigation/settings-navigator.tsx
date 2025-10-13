import type React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MainSettingsScreen } from "../screens/main-settings-screen";
import { ProfileScreen } from "../screens/profile-screen";
import { QuestionnaireScreen } from "../screens/questionnaire-screen";

export type SettingsStackParamList = {
  MainSettings: undefined;
  Profile: undefined;
  Questionnaire: undefined;
};

const SettingsStack = createStackNavigator<SettingsStackParamList>();

/**
 * Settings stack navigator
 * Handles navigation between different settings screens
 */
export const SettingsNavigator: React.FC = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <SettingsStack.Screen
        name="MainSettings"
        component={MainSettingsScreen}
        options={{
          title: "Settings",
        }}
      />
      <SettingsStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          gestureEnabled: true,
        }}
      />
      <SettingsStack.Screen
        name="Questionnaire"
        component={QuestionnaireScreen}
        options={{
          title: "Questionnaire Details",
          gestureEnabled: true,
        }}
      />
    </SettingsStack.Navigator>
  );
};

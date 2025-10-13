import { createStackNavigator } from "@react-navigation/stack";
import type React from "react";
import { LoginScreen, selectIsAuthenticated } from "#root/features/auth";
import { OnboardingScreen, selectIsOnboardingCompleted } from "#root/features/onboarding";
import { useAppSelector } from "#root/store/store";
import type { RootStackParamList } from "../routes";
import { AppTabNavigator } from "./app-tab-navigator";

const RootStack = createStackNavigator<RootStackParamList>();

export const RootStackNavigator: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isOnboardingCompleted = useAppSelector(selectIsOnboardingCompleted);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isOnboardingCompleted ? (
        <RootStack.Group>
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        </RootStack.Group>
      ) : !isAuthenticated ? (
        <RootStack.Group>
          <RootStack.Screen name="Login" component={LoginScreen} />
        </RootStack.Group>
      ) : (
        <RootStack.Group>
          <RootStack.Screen name="Authenticated" component={AppTabNavigator} />
        </RootStack.Group>
      )}
    </RootStack.Navigator>
  );
};

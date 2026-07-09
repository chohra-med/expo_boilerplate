import { createStackNavigator } from "@react-navigation/stack";
import type React from "react";
import { LoginScreen } from "#root/features/auth";
import { WireOnboardingScreen } from "#root/features/onboarding";
import type { OnboardingStackParamsList } from "../routes";

const OnboardingStack = createStackNavigator<OnboardingStackParamsList>();

export const OnboardingStackNavigator: React.FC = () => {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      {/* AI onboarding by default (with a static fallback); static-only when no Wire key is set. */}
      <OnboardingStack.Screen name="OnboardingFlow" component={WireOnboardingScreen} />
      <OnboardingStack.Screen name="Login" component={LoginScreen} />
    </OnboardingStack.Navigator>
  );
};

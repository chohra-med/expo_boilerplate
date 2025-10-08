import { createStackNavigator } from '@react-navigation/stack';
import type React from 'react';
import { LoginScreen } from '#root/features/auth';
import { OnboardingScreen } from '#root/features/onboarding';
import type { OnboardingStackParamsList } from '../routes';

const OnboardingStack = createStackNavigator<OnboardingStackParamsList>();

export const OnboardingStackNavigator: React.FC = () => {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="OnboardingFlow" component={OnboardingScreen} />
      <OnboardingStack.Screen name="Login" component={LoginScreen} />
    </OnboardingStack.Navigator>
  );
};

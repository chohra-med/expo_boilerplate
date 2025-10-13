import type { NavigatorScreenParams } from "@react-navigation/native";

// Navigation type definitions
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Authenticated: NavigatorScreenParams<AppTabStackParamsList>;
};

export type OnboardingStackParamsList = {
  Welcome: undefined;
  Login: undefined;
  OnboardingFlow: undefined;
};

export type AppTabStackParamsList = {
  Home: undefined;
  Todos: undefined;
  Settings: undefined;
};

// Helper type for no-args routes
declare global {
  namespace routeTypes {
    interface NoArgs {}
  }
}

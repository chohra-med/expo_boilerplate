import type { NavigatorScreenParams } from "@react-navigation/native";

// Settings navigation types
export type SettingsStackParamList = {
  MainSettings: undefined;
  Profile: undefined;
  Questionnaire: undefined;
};

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
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

// Helper type for no-args routes
declare global {
  namespace routeTypes {
    interface NoArgs {}
  }
}

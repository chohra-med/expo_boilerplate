const noArgs = () => ({}) satisfies routeTypes.NoArgs;

export const routes = {
  Onboarding: {
    Welcome: {
      name: "Welcome",
      args: noArgs,
    } as const,
    Login: {
      name: "Login",
      args: noArgs,
    } as const,
    OnboardingFlow: {
      name: "OnboardingFlow",
      args: noArgs,
    } as const,
  },
  Authenticated: {
    AppTabs: {
      Home: {
        name: "Home",
        args: noArgs,
      } as const,
      Todos: {
        name: "Todos",
        args: noArgs,
      } as const,
      Settings: {
        name: "Settings",
        args: noArgs,
      } as const,
    },
  },
} as const;

// Re-export types for convenience
export type {
  AppTabStackParamsList,
  OnboardingStackParamsList,
  RootStackParamList,
} from "./routes.types";

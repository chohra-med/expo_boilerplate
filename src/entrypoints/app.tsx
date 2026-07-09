import { NavigationContainer, type NavigationContainerRef } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { CoachmarkProvider } from "wireai-onboarding/coachmarks";
import { useScreenTracking } from "#root/analytics";
import { IS_TESTING_COACHMARK } from "#root/config/coachmarks";
import { useAppInitializer } from "#root/entrypoints/hooks";
import { RootStackNavigator } from "#root/navigation/navigators/root-stack-navigator";
import type { RootStackParamList } from "#root/navigation/routes";
import { coachmarkStorage } from "#root/services/storage";
import { persistor, store } from "#root/store/store";
import { ToastProvider } from "#root/ui/components/toast-provider";
import { ThemeProvider, useTheme } from "#root/ui/style/theme-provider";
import "#root/config/i18n";
import { AppErrorBoundary } from "#root/providers/app-error-boundary/app-error-boundary";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const AppContent: React.FC = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const routeNameRef = useRef<string | undefined>(undefined);

  // Boot core services (Firebase Analytics + Crashlytics + RevenueCat) and emit APP_OPEN.
  useAppInitializer();

  // Screen tracking: emits SCREEN_VIEW / SCREEN_EXIT through the analytics facade.
  const { onScreenChange } = useScreenTracking();

  // Brand color for the coachmark ring + tooltip.
  const { theme } = useTheme();

  const [fontsLoaded] = useFonts({
    // "Inter-Regular": require("../../assets/fonts/Inter-Regular.ttf"),
    // "Inter-Medium": require("../../assets/fonts/Inter-Medium.ttf"),
    // "Inter-SemiBold": require("../../assets/fonts/Inter-SemiBold.ttf"),
    // "Inter-Bold": require("../../assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const handleNavigationStateChange = useCallback(() => {
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
    if (currentRouteName && routeNameRef.current !== currentRouteName) {
      onScreenChange(currentRouteName);
      routeNameRef.current = currentRouteName;
    }
  }, [onScreenChange]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          {/*
            Guided-tour engine (wireai-onboarding/coachmarks). Mounted ONCE here,
            around the NavigationContainer, so its overlay host is a root-level
            sibling of the whole app — that placement lets a coachmark ring + blur
            paint ABOVE the bottom tab bar (which react-navigation draws over
            screen content). It takes a SYNCHRONOUS storage adapter so "seen"
            gates resolve during render with no ring flash. See src/config/coachmarks.ts.
          */}
          <CoachmarkProvider
            storage={coachmarkStorage}
            accentColor={theme.colors.primary}
            isTestingCoachmark={IS_TESTING_COACHMARK}
          >
            <NavigationContainer ref={navigationRef} onStateChange={handleNavigationStateChange}>
              <RootStackNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </CoachmarkProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <ToastProvider>
            <AppErrorBoundary>
              <AppContent />
            </AppErrorBoundary>
          </ToastProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

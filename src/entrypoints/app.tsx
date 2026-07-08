import { NavigationContainer, type NavigationContainerRef } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useScreenTracking } from "#root/analytics";
import { useAppInitializer } from "#root/entrypoints/hooks";
import { RootStackNavigator } from "#root/navigation/navigators/root-stack-navigator";
import type { RootStackParamList } from "#root/navigation/routes";
import { persistor, store } from "#root/store/store";
import { ToastProvider } from "#root/ui/components/toast-provider";
import { ThemeProvider } from "#root/ui/style/theme-provider";
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
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef} onStateChange={handleNavigationStateChange}>
          <RootStackNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
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

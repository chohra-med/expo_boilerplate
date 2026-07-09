/**
 * App Initializer Hook
 *
 * @description Boots the app's core services once on startup: Firebase Analytics,
 * the typed analytics facade, Crashlytics, and RevenueCat. Records the app-open
 * lifecycle event. Kept intentionally minimal for the Lite boilerplate (no
 * Sentry — Crashlytics is the only crash channel).
 *
 * @example
 * ```typescript
 * const { isInitialized } = useAppInitializer();
 * ```
 */

import { useCallback, useEffect, useState } from "react";
import { analytics, EVENTS } from "#root/analytics";
import { initializeCrashlytics, initializeFirebaseAnalytics } from "#root/services/analytics";
import { logger } from "#root/services/logging";
import { initializeRevenueCat } from "#root/services/revenuecat";

export type AppInitializerResult = {
  isInitialized: boolean;
};

export function useAppInitializer(): AppInitializerResult {
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeServices = useCallback(async () => {
    try {
      // 1. Firebase Analytics + typed facade (applies the __DEV__ collection gate),
      //    then record the app-open lifecycle event.
      await initializeFirebaseAnalytics();
      await analytics.init();
      analytics.track(EVENTS.APP_OPEN);

      // 2. Crashlytics (silent crash channel).
      await initializeCrashlytics();

      // 3. RevenueCat (no-ops gracefully when no API key is configured).
      await initializeRevenueCat();

      setIsInitialized(true);
      logger.logEvent("app_initialized", { timestamp: Date.now() });
    } catch (error) {
      // Never let service init break boot.
      logger.error(
        "App initialization failed",
        error instanceof Error ? error : new Error(String(error))
      );
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    initializeServices();
  }, [initializeServices]);

  return { isInitialized };
}

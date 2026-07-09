import crashlyticsModule from "@react-native-firebase/crashlytics";
import { Platform } from "react-native";

/**
 * Firebase Crashlytics Service
 * Provides error tracking and crash reporting
 */

// Safe console logger that doesn't call app logger (prevents circular logging)
// Only used for internal crashlytics initialization errors
const safeLog = (message: string, error?: Error) => {
  if (!__DEV__) return;
  if (error) {
    console.error(`[Crashlytics Internal] ${message}`, error);
  } else {
    console.log(`[Crashlytics Internal] ${message}`);
  }
};

// Mock Crashlytics for development/web
const mockCrashlytics = {
  recordError: async (_error: Error, _jsErrorName?: string) => {
    return;
  },
  log: (_message: string) => {
    return;
  },
  setAttribute: async (_key: string, _value: string) => {
    return;
  },
  setAttributes: async (_attributes: Record<string, string>) => {
    return;
  },
  setUserId: async (_userId: string) => {
    return;
  },
  setCrashlyticsCollectionEnabled: async (_enabled: boolean) => {
    return;
  },
  crash: () => {
    if (__DEV__) {
      safeLog("Crash test - would crash in production");
    }
  },
};

// Real Crashlytics instance
let crashlyticsInstance: typeof mockCrashlytics | null = null;

/**
 * Initialize Firebase Crashlytics
 */
export const initializeCrashlytics = async () => {
  try {
    // Check if Crashlytics is available
    if (Platform.OS === "web") {
      safeLog("Crashlytics not available on web, using mock");
      crashlyticsInstance = mockCrashlytics;
      return;
    }

    // Initialize Crashlytics
    const crashlytics = crashlyticsModule();

    // Enable Crashlytics collection (disabled by default in debug builds)
    await crashlytics.setCrashlyticsCollectionEnabled(!__DEV__);

    crashlyticsInstance = {
      recordError: async (error: Error, jsErrorName?: string) => {
        await crashlytics.recordError(error, jsErrorName);
      },
      log: (message: string) => {
        crashlytics.log(message);
      },
      setAttribute: async (key: string, value: string) => {
        await crashlytics.setAttribute(key, value);
      },
      setAttributes: async (attributes: Record<string, string>) => {
        await crashlytics.setAttributes(attributes);
      },
      setUserId: async (userId: string) => {
        await crashlytics.setUserId(userId);
      },
      setCrashlyticsCollectionEnabled: async (enabled: boolean) => {
        await crashlytics.setCrashlyticsCollectionEnabled(enabled);
      },
      crash: () => {
        crashlytics.crash();
      },
    };

    safeLog("Firebase Crashlytics initialized successfully");
  } catch (error) {
    safeLog("Failed to initialize Firebase Crashlytics", error as Error);
    crashlyticsInstance = mockCrashlytics;
  }
};

/**
 * Get Crashlytics instance
 */
const getCrashlytics = () => {
  if (!crashlyticsInstance) {
    safeLog("Using mock crashlytics (not initialized)");
    return mockCrashlytics;
  }
  return crashlyticsInstance;
};

/**
 * Internal Crashlytics Implementation
 *
 * @description This is the internal implementation used by the crashlytics.transport.
 * External code should use the unified logger from `#root/services/logging` instead.
 *
 * @internal
 */
export const crashlyticsService = {
  recordError: async (error: Error, jsErrorName?: string) => {
    try {
      const crashlytics = getCrashlytics();
      await crashlytics.recordError(error, jsErrorName);
    } catch (err) {
      safeLog("Failed to record error", err as Error);
    }
  },

  log: (message: string) => {
    try {
      const crashlytics = getCrashlytics();
      crashlytics.log(message);
    } catch (error) {
      safeLog("Failed to log message", error as Error);
    }
  },

  setAttributes: async (attributes: Record<string, string>) => {
    try {
      const crashlytics = getCrashlytics();
      await crashlytics.setAttributes(attributes);
    } catch (error) {
      safeLog("Failed to set attributes", error as Error);
    }
  },

  setUserId: async (userId: string) => {
    try {
      const crashlytics = getCrashlytics();
      await crashlytics.setUserId(userId);
    } catch (error) {
      safeLog("Failed to set user ID", error as Error);
    }
  },
};

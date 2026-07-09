import analyticsModule from "@react-native-firebase/analytics";
import { Platform } from "react-native";

// Flag to prevent circular logging
let isLoggingError = false;

// Safe console logger that doesn't call analytics (prevents circular dependency)
// Only used for internal analytics errors
const safeLog = (message: string, error?: Error) => {
  if (__DEV__) {
    if (error) {
      console.error(`[Analytics Internal] ${message}`, error);
    } else {
      console.log(`[Analytics Internal] ${message}`);
    }
  }
};

// Firebase Analytics interface
interface FirebaseAnalytics {
  logEvent: (eventName: string, parameters?: Record<string, unknown>) => Promise<void>;
  logScreenView: (screen_name: string, screen_class?: string) => Promise<void>;
  setUserProperties: (properties: Record<string, unknown>) => Promise<void>;
  setUserId: (userId: string) => Promise<void>;
  setAnalyticsCollectionEnabled: (enabled: boolean) => Promise<void>;
  resetAnalyticsData: () => Promise<void>;
}

// Mock Firebase Analytics for development (silent - no console logs)
const mockFirebaseAnalytics: FirebaseAnalytics = {
  logEvent: async (_eventName: string, _parameters?: Record<string, unknown>) => {
    // Silent - logger.ts handles console output
    return;
  },
  logScreenView: async (_screen_name: string, _screen_class?: string) => {
    // Silent - logger.ts handles console output
    return;
  },
  setUserProperties: async (_properties: Record<string, unknown>) => {
    // Silent - logger.ts handles console output
    return;
  },
  setUserId: async (_userId: string) => {
    // Silent - logger.ts handles console output
    return;
  },
  setAnalyticsCollectionEnabled: async (_enabled: boolean) => {
    return;
  },
  resetAnalyticsData: async () => {
    return;
  },
};

// Real Firebase Analytics instance
let firebaseAnalyticsInstance: FirebaseAnalytics | null = null;

// Initialize Firebase Analytics
export const initializeFirebaseAnalytics = async () => {
  try {
    // Check if Firebase Analytics is available
    if (Platform.OS === "web") {
      safeLog("Firebase Analytics not available on web, using mock");
      firebaseAnalyticsInstance = mockFirebaseAnalytics;
      return;
    }

    // Initialize Firebase Analytics
    const analytics = analyticsModule();

    // Enable analytics collection (disabled by default in debug builds)
    await analytics.setAnalyticsCollectionEnabled(!__DEV__);

    firebaseAnalyticsInstance = {
      logEvent: async (eventName: string, parameters?: Record<string, unknown>) => {
        // Convert parameters to Firebase-compatible format
        const firebaseParams = convertToFirebaseParams(parameters);
        await analytics.logEvent(eventName, firebaseParams);
      },
      logScreenView: async (screen_name: string, screen_class?: string) => {
        // Send to Firebase (silent - no console logging)
        await analytics.logScreenView({ screen_name, screen_class });
      },
      setUserProperties: async (properties: Record<string, unknown>) => {
        // Convert unknown values to strings for Firebase Analytics
        const stringProperties: Record<string, string | null> = {};
        Object.entries(properties).forEach(([key, value]) => {
          stringProperties[key] = value === null || value === undefined ? null : String(value);
        });
        await analytics.setUserProperties(stringProperties);
      },
      setUserId: async (userId: string) => {
        await analytics.setUserId(userId);
      },
      setAnalyticsCollectionEnabled: async (enabled: boolean) => {
        await analytics.setAnalyticsCollectionEnabled(enabled);
      },
      resetAnalyticsData: async () => {
        await analytics.resetAnalyticsData();
      },
    };

    safeLog("Firebase Analytics initialized successfully");
  } catch (error) {
    safeLog("Failed to initialize Firebase Analytics", error as Error);
    firebaseAnalyticsInstance = mockFirebaseAnalytics;
  }
};

// Convert parameters to Firebase-compatible format
// Firebase Analytics only supports: string, number (boolean converted to number)
const convertToFirebaseParams = (
  parameters?: Record<string, unknown>
): Record<string, string | number> | undefined => {
  if (!parameters) return undefined;

  const converted: Record<string, string | number> = {};

  Object.entries(parameters).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      // Skip null/undefined values
      return;
    }

    if (typeof value === "string" || typeof value === "number") {
      converted[key] = value;
    } else if (typeof value === "boolean") {
      // Convert boolean to number (0 or 1) for Firebase Analytics
      converted[key] = value ? 1 : 0;
    } else if (typeof value === "object") {
      // Convert objects to JSON strings
      try {
        converted[key] = JSON.stringify(value);
      } catch {
        // If stringify fails, convert to string
        converted[key] = String(value);
      }
    } else {
      // Convert everything else to string
      converted[key] = String(value);
    }
  });

  return converted;
};

// Get the appropriate analytics instance
const getAnalytics = (): FirebaseAnalytics => {
  if (!firebaseAnalyticsInstance) {
    if (__DEV__) {
      safeLog("Using mock analytics (Firebase not initialized)");
    }
    return mockFirebaseAnalytics;
  }

  return firebaseAnalyticsInstance;
};

/**
 * Internal Analytics Implementation
 *
 * @description This is the internal implementation used by the firebase-analytics.transport.
 * External code should use the unified logger from `#root/services/logging` instead.
 *
 * @internal
 */
export const analytics = {
  logEvent: async (eventName: string, parameters?: Record<string, unknown>) => {
    if (isLoggingError) return;

    try {
      const analyticsInstance = getAnalytics();
      await analyticsInstance.logEvent(eventName, parameters);
    } catch (error) {
      isLoggingError = true;
      safeLog(`Failed to log event: ${eventName}`, error as Error);
      isLoggingError = false;
    }
  },

  logScreenView: async (screenName: string, screenClass?: string) => {
    if (isLoggingError) return;

    try {
      const analyticsInstance = getAnalytics();
      await analyticsInstance.logScreenView(screenName, screenClass);
    } catch (error) {
      isLoggingError = true;
      safeLog(`Failed to log screen view: ${screenName}`, error as Error);
      isLoggingError = false;
    }
  },

  logData: async (data: Record<string, unknown>) => {
    if (isLoggingError) return;

    try {
      const analyticsInstance = getAnalytics();
      await analyticsInstance.setUserProperties(data);
    } catch (error) {
      isLoggingError = true;
      safeLog("Failed to log user data", error as Error);
      isLoggingError = false;
    }
  },

  setUserId: async (userId: string) => {
    if (isLoggingError) return;

    try {
      const analyticsInstance = getAnalytics();
      await analyticsInstance.setUserId(userId);
    } catch (error) {
      isLoggingError = true;
      safeLog("Failed to set user ID", error as Error);
      isLoggingError = false;
    }
  },
};

import { logger } from "../logging/logger";

// Firebase Analytics interface
interface FirebaseAnalytics {
  logEvent: (eventName: string, parameters?: Record<string, unknown>) => Promise<void>;
  setUserProperties: (properties: Record<string, unknown>) => Promise<void>;
  setUserId: (userId: string) => Promise<void>;
}

// Mock Firebase Analytics for development
const mockFirebaseAnalytics: FirebaseAnalytics = {
  logEvent: async (_eventName: string, _parameters?: Record<string, unknown>) => {
    return;
  },
  setUserProperties: async (_properties: Record<string, unknown>) => {
    return;
  },
  setUserId: async (_userId: string) => {
    return;
  },
};

// Real Firebase Analytics (to be implemented when Firebase is added)
const firebaseAnalytics: FirebaseAnalytics | null = null;

// Initialize Firebase Analytics
export const initializeFirebaseAnalytics = async () => {
  try {
    // TODO: Initialize Firebase Analytics here
    // const analytics = getAnalytics();
    // firebaseAnalytics = analytics;
    logger.log("[Analytics] Firebase Analytics initialized");
  } catch (error) {
    logger.error("[Analytics] Failed to initialize Firebase Analytics", error as Error);
  }
};

// Get the appropriate analytics instance
const getAnalytics = (): FirebaseAnalytics => {
  if (__DEV__) {
    return mockFirebaseAnalytics;
  }

  if (!firebaseAnalytics) {
    logger.error(
      "[Analytics] Firebase Analytics not initialized",
      new Error("Analytics not available")
    );
    return mockFirebaseAnalytics;
  }

  return firebaseAnalytics;
};

export const analytics = {
  // Log a custom event
  logEvent: async (eventName: string, parameters?: Record<string, unknown>) => {
    try {
      const analyticsInstance = getAnalytics();
      await analyticsInstance.logEvent(eventName, parameters);
    } catch (error) {
      logger.error(`[Analytics] Failed to log event: ${eventName}`, error as Error);
    }
  },

  // Log user data/properties
  logData: async (data: Record<string, unknown>) => {
    try {
      const analyticsInstance = getAnalytics();
      await analyticsInstance.setUserProperties(data);
    } catch (error) {
      logger.error("[Analytics] Failed to log user data", error as Error);
    }
  },

  // Record an error
  recordError: async (error: Error, context?: Record<string, unknown>) => {
    try {
      const analyticsInstance = getAnalytics();
      await analyticsInstance.logEvent("error_occurred", {
        error_message: error.message,
        error_stack: error.stack,
        error_name: error.name,
        ...context,
      });
    } catch (analyticsError) {
      logger.error("[Analytics] Failed to record error", analyticsError as Error);
    }
  },

  // Set user ID
  setUserId: async (userId: string) => {
    try {
      const analyticsInstance = getAnalytics();
      await analyticsInstance.setUserId(userId);
    } catch (error) {
      logger.error("[Analytics] Failed to set user ID", error as Error);
    }
  },

  // Legacy methods for backward compatibility
  log: async (message: string, data?: unknown) => {
    await analytics.logEvent("custom_log", { message, data });
  },

  error: async (message: string, error: Error) => {
    await analytics.recordError(error, { message });
  },
};

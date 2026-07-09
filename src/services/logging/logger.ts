import { consoleTransport } from "./transports/console.transport";
import { crashlyticsTransport } from "./transports/crashlytics.transport";
import { firebaseAnalyticsTransport } from "./transports/firebase-analytics.transport";
import type { LogEntry, LoggerTransport } from "./transports/types";
import { LogLevel } from "./transports/types";

export { LogLevel };

const USE_AI_DEBUGGING = false;

// Logger interface
export interface Logger {
  logScreenView: (screenName: string, screenClass?: string) => void;
  logEvent: (eventName: string, parameters?: Record<string, unknown>) => void;
  logData: (data: Record<string, unknown>) => void;
  setUserProperties: (properties: Record<string, unknown>) => void;
  setUserId: (userId: string) => void;
  recordError: (error: Error, context?: Record<string, unknown>) => void;
  log: (message: string, data?: unknown, level?: LogLevel) => void;
  error: (message: string, error: Error) => void;
  warn: (message: string, data?: unknown) => void;
  info: (message: string, data?: unknown) => void;
  debug: (message: string, data?: unknown) => void;
  appDetailsDebugging: (message: string, data?: unknown) => void;
}

// Keep logger safe: never use logger inside this helper (avoids recursion).
const safeDevConsoleError = (message: string, error: unknown) => {
  if (!__DEV__) return;
  console.error(`[Logger Internal] ${message}`, error);
};

const defaultTransports: LoggerTransport[] = [
  consoleTransport,
  // Production pipelines (silent transports)
  firebaseAnalyticsTransport,
  crashlyticsTransport,
];

let transports: LoggerTransport[] = defaultTransports;

/**
 * Optional configuration hook if you want to swap/add transports (e.g. performance).
 */
export const configureLogger = (nextTransports: LoggerTransport[]) => {
  transports = nextTransports;
};

const dispatch = (entry: LogEntry) => {
  transports.forEach((transport) => {
    try {
      const result = transport.handle(entry);
      if (result instanceof Promise) {
        result.catch((err) => safeDevConsoleError(`${transport.name} transport failed`, err));
      }
    } catch (err) {
      safeDevConsoleError(`${transport.name} transport threw`, err);
    }
  });
};

/**
 * Global Logger Service
 *
 * @description Single source of truth for logging in the application.
 * - Handles console logging for development (only in __DEV__)
 * - Forwards events to analytics service (Firebase) for production tracking
 * - Forwards errors to crash reporting service (Crashlytics)
 * - Supports multiple log levels (DEBUG, INFO, WARN, ERROR)
 *
 * Architecture:
 * - Logger (this file) → emits structured LogEntry → fan-out to transports
 * - Console transport → dev-only console output
 * - Firebase Analytics transport → silent, only sends to Firebase Analytics
 * - Crashlytics transport → silent, only sends to Crashlytics
 *
 * This prevents duplication of console logs across services.
 */
export const logger: Logger = {
  /**
   * Log screen view events with colored console output in development
   * @param screenName - Name of the screen being viewed
   * @param screenClass - Class/component name of the screen
   */
  logScreenView: (screenName: string, screenClass?: string): void => {
    dispatch({ type: "screen_view", screenName, screenClass });
  },

  /**
   * Log a custom event
   * @param eventName - Name of the event
   * @param parameters - Event parameters
   */
  logEvent: (eventName: string, parameters?: Record<string, unknown>) => {
    dispatch({ type: "event", eventName, parameters });
  },

  /**
   * Log user data/properties
   * @param data - User data to log
   */
  logData: (data: Record<string, unknown>) => {
    dispatch({ type: "user_properties", properties: data });
  },

  /**
   * Set user properties (alias for logData for clarity)
   * @param properties - User properties to set
   */
  setUserProperties: (properties: Record<string, unknown>) => {
    dispatch({ type: "user_properties", properties });
  },

  /**
   * Set user ID for tracking across all services
   * @param userId - User ID to set
   */
  setUserId: (userId: string) => {
    dispatch({ type: "user_id", userId });
  },

  /**
   * Record an error
   * @param error - Error object
   * @param context - Additional context about the error
   */
  recordError: (error: Error, context?: Record<string, unknown>) => {
    dispatch({ type: "error", error, context });
  },

  /**
   * General log method
   * @param message - Log message
   * @param data - Additional data to log
   * @param level - Log level
   */
  log: (message: string, data?: unknown, level: LogLevel = LogLevel.INFO) => {
    dispatch({ type: "message", level, message, data });
  },

  /**
   * Error logging
   * @param message - Error message
   * @param error - Error object
   */
  error: (message: string, error: Error) => {
    dispatch({ type: "message", level: LogLevel.ERROR, message, data: { error } });
    dispatch({ type: "error", error, context: { message } });
  },

  /**
   * Warning logging
   * @param message - Warning message
   * @param data - Additional data
   */
  warn: (message: string, data?: unknown) => {
    dispatch({ type: "message", level: LogLevel.WARN, message, data });
  },

  /**
   * Info logging
   * @param message - Info message
   * @param data - Additional data
   */
  info: (message: string, data?: unknown) => {
    dispatch({ type: "message", level: LogLevel.INFO, message, data });
  },

  /**
   * Debug logging
   * @param message - Debug message
   * @param data - Additional data
   */
  debug: (message: string, data?: unknown) => {
    dispatch({ type: "message", level: LogLevel.DEBUG, message, data });
  },

  /**
   * App details debugging (for AI debugging)
   * @param message - Debug message
   * @param data - Additional data
   */
  appDetailsDebugging: (message: string, data?: unknown) => {
    if (USE_AI_DEBUGGING) {
      return;
    }
    // Debug-only signal; transports decide what to do with it.
    dispatch({ type: "message", level: LogLevel.APP_DETAILS_DEBUGGING, message, data });
  },
};

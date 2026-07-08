import { analytics } from "#root/services/analytics/analytics";
import type { LogEntry, LoggerTransport } from "./types";

/**
 * Firebase Analytics transport.
 *
 * IMPORTANT:
 * - This transport must be silent (no console logging).
 * - Errors inside this transport should never call the app logger to avoid recursion.
 */
export const firebaseAnalyticsTransport: LoggerTransport = {
  name: "firebase-analytics",
  handle: async (entry: LogEntry) => {
    switch (entry.type) {
      case "screen_view":
        await analytics.logScreenView(entry.screenName, entry.screenClass);
        return;

      case "event":
        await analytics.logEvent(entry.eventName, entry.parameters);
        return;

      case "user_properties":
        await analytics.logData(entry.properties);
        return;

      case "user_id":
        await analytics.setUserId(entry.userId);
        return;

      case "error":
        return;

      case "message":
        // Intentionally no-op: use `logEvent` / `logScreenView` / `logData` for analytics.
        // General logs stay in console (dev) and crash reporting (errors/warnings).
        return;
    }
  },
};

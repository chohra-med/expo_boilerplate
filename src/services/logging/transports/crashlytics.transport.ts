import { crashlyticsService } from "#root/services/analytics/crashlytics";
import { type LogEntry, type LoggerTransport, LogLevel } from "./types";

/**
 * Crashlytics transport.
 *
 * IMPORTANT:
 * - Must be silent (no console logging).
 * - Must never call the app logger to avoid recursion.
 */
export const crashlyticsTransport: LoggerTransport = {
  name: "crashlytics",
  handle: async (entry: LogEntry) => {
    switch (entry.type) {
      case "error":
        if (entry.context) {
          // Attach context as breadcrumbs/attributes where possible.
          await crashlyticsService.setAttributes(
            Object.fromEntries(
              Object.entries(entry.context).map(([k, v]) => [k, v == null ? "" : String(v)])
            )
          );
        }
        await crashlyticsService.recordError(entry.error);
        return;

      case "message": {
        // Only forward high-signal messages to Crashlytics.
        if (entry.level === LogLevel.ERROR || entry.level === LogLevel.WARN) {
          crashlyticsService.log(`${entry.level}: ${entry.message}`);
        }
        return;
      }

      // Not relevant for Crashlytics
      case "event":
      case "screen_view":
        return;

      case "user_properties":
        // Could set attributes here if needed in the future
        return;

      case "user_id":
        await crashlyticsService.setUserId(entry.userId);
        return;
    }
  },
};

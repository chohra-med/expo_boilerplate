import { Platform } from "react-native";
import { type LogEntry, type LoggerTransport, LogLevel } from "./types";

const formatLogMessage = (message: string, level: LogLevel = LogLevel.INFO): string => {
  return ` [${level}] ${message}`;
};

const logToConsole = (entry: LogEntry): void => {
  if (!__DEV__) return;

  switch (entry.type) {
    case "screen_view": {
      // High visibility screen view in dev
      // Check if we're in a web environment (browser console supports CSS styling)
      const isWebEnvironment =
        Platform.OS === "web" || (typeof window !== "undefined" && window.document);

      if (isWebEnvironment) {
        // Use CSS styling for web browsers (works in browser console)
        console.log(
          `%c 📱 SCREEN VIEW %c ${entry.screenName} `,
          "background: #00bcd4; color: #000; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;",
          "background: #0097a7; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;"
        );
      } else {
        // For React Native (iOS/Android), try using console.group for better visibility
        // This creates a collapsible group in most console implementations
        console.group(`📱 SCREEN VIEW: ${entry.screenName}`);
        console.log(`Screen: ${entry.screenName}`);
        console.groupEnd();
      }
      return;
    }

    case "event": {
      console.info(
        formatLogMessage(`Event: ${entry.eventName}`, LogLevel.INFO),
        entry.parameters || ""
      );
      return;
    }

    case "user_properties": {
      console.info(formatLogMessage("User Properties:", LogLevel.INFO), entry.properties);
      return;
    }

    case "user_id": {
      console.info(formatLogMessage(`User ID: ${entry.userId}`, LogLevel.INFO));
      return;
    }

    case "error": {
      console.error(formatLogMessage(`Error: ${entry.error.message}`, LogLevel.ERROR), {
        error: entry.error,
        context: entry.context,
      });
      return;
    }

    case "message": {
      const formatted = formatLogMessage(entry.message, entry.level);
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(formatted, entry.data || "");
          return;
        case LogLevel.INFO:
          console.info(formatted, entry.data || "");
          return;
        case LogLevel.WARN:
          console.warn(formatted, entry.data || "");
          return;
        case LogLevel.ERROR:
          console.error(formatted, entry.data || "");
          return;
        default:
          console.log(formatted, entry.data || "");
          return;
      }
    }
  }
};

export const consoleTransport: LoggerTransport = {
  name: "console",
  handle: logToConsole,
};

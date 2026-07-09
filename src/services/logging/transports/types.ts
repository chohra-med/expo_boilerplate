// Log levels for better categorization
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  APP_DETAILS_DEBUGGING = "APP_DETAILS_DEBUGGING",
}

export type LogEntry =
  | {
      type: "screen_view";
      screenName: string;
      screenClass?: string;
    }
  | {
      type: "event";
      eventName: string;
      parameters?: Record<string, unknown>;
    }
  | {
      type: "user_properties";
      properties: Record<string, unknown>;
    }
  | {
      type: "user_id";
      userId: string;
    }
  | {
      type: "error";
      error: Error;
      context?: Record<string, unknown>;
    }
  | {
      type: "message";
      level: LogLevel;
      message: string;
      data?: unknown;
    };

export interface LoggerTransport {
  /**
   * Transport name for debugging/diagnostics.
   */
  name: string;

  /**
   * Handle a log entry. Should be safe to call often.
   */
  handle: (entry: LogEntry) => void | Promise<void>;
}

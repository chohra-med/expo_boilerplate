import { analytics } from '../analytics/analytics';

// Log levels for better categorization
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

// Logger interface
export interface Logger {
  logEvent: (eventName: string, parameters?: Record<string, unknown>) => void;
  logData: (data: Record<string, unknown>) => void;
  recordError: (error: Error, context?: Record<string, unknown>) => void;
  log: (message: string, data?: unknown, level?: LogLevel) => void;
  error: (message: string, error: Error) => void;
  warn: (message: string, data?: unknown) => void;
  info: (message: string, data?: unknown) => void;
  debug: (message: string, data?: unknown) => void;
}

// Format log message with timestamp and level
const formatLogMessage = (message: string, level: LogLevel = LogLevel.INFO): string => {
  return ` [${level}] ${message}`;
};

// Console logging helper
const consoleLog = (message: string, data?: unknown, level: LogLevel = LogLevel.INFO) => {
  if (__DEV__) {
    const formattedMessage = formatLogMessage(message, level);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, data || '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data || '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, data || '');
        break;
      default:
        console.log(formattedMessage, data || '');
    }
  }
};

export const logger: Logger = {
  // Log a custom event (for analytics)
  logEvent: (eventName: string, parameters?: Record<string, unknown>) => {
    consoleLog(`Event: ${eventName}`, parameters, LogLevel.INFO);
    analytics.logEvent(eventName, parameters).catch((error) => {
      console.error('[Logger] Failed to log event to analytics:', error);
    });
  },

  // Log user data (for analytics)
  logData: (data: Record<string, unknown>) => {
    consoleLog('User Data:', data, LogLevel.INFO);
    analytics.logData(data).catch((error) => {
      console.error('[Logger] Failed to log data to analytics:', error);
    });
  },

  // Record an error (for analytics)
  recordError: (error: Error, context?: Record<string, unknown>) => {
    consoleLog(`Error: ${error.message}`, { error, context }, LogLevel.ERROR);
    analytics.recordError(error, context).catch((analyticsError) => {
      console.error('[Logger] Failed to record error to analytics:', analyticsError);
    });
  },

  // General log method
  log: (message: string, data?: unknown, level: LogLevel = LogLevel.INFO) => {
    consoleLog(message, data, level);
    analytics.log(message, data).catch((error) => {
      console.error('[Logger] Failed to log to analytics:', error);
    });
  },

  // Error logging
  error: (message: string, error: Error) => {
    consoleLog(message, { error }, LogLevel.ERROR);
    analytics.error(message, error).catch((analyticsError) => {
      console.error('[Logger] Failed to log error to analytics:', analyticsError);
    });
  },

  // Warning logging
  warn: (message: string, data?: unknown) => {
    consoleLog(message, data, LogLevel.WARN);
    analytics.logEvent('warning', { message, data }).catch((error) => {
      console.error('[Logger] Failed to log warning to analytics:', error);
    });
  },

  // Info logging
  info: (message: string, data?: unknown) => {
    consoleLog(message, data, LogLevel.INFO);
    analytics.logEvent('info', { message, data }).catch((error) => {
      console.error('[Logger] Failed to log info to analytics:', error);
    });
  },

  // Debug logging
  debug: (message: string, data?: unknown) => {
    consoleLog(message, data, LogLevel.DEBUG);
    analytics.logEvent('debug', { message, data }).catch((error) => {
      console.error('[Logger] Failed to log debug to analytics:', error);
    });
  },
};

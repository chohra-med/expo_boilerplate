# Logger System

A comprehensive logging system that provides both console logging (in development) and Firebase Analytics integration (in production).

## Features

- **Development Mode**: Logs to console with timestamps and log levels
- **Production Mode**: Sends logs to Firebase Analytics
- **Multiple Log Levels**: DEBUG, INFO, WARN, ERROR
- **Event Tracking**: Custom events for analytics
- **User Data Logging**: Track user properties and data
- **Error Recording**: Comprehensive error tracking with context

## Usage

### Basic Logging

```typescript
import { logger } from '#root/services/logging';

// General logging
logger.log('User action completed', { userId: '123' });

// Different log levels
logger.debug('Debug information', { step: 'initialization' });
logger.info('Information message', { data: 'value' });
logger.warn('Warning message', { deprecated: true });
logger.error('Error occurred', new Error('Something went wrong'));
```

### Event Tracking

```typescript
// Log custom events for analytics
logger.logEvent('user_button_click', {
  button_name: 'login',
  screen: 'auth',
  timestamp: Date.now(),
});

logger.logEvent('screen_view', {
  screen_name: 'home',
  screen_class: 'HomeScreen',
});
```

### User Data Logging

```typescript
// Log user properties and data
logger.logData({
  user_id: '12345',
  age: 25,
  preferences: {
    theme: 'dark',
    language: 'en',
  },
});
```

### Error Recording

```typescript
// Record errors with context
try {
  // Your code here
} catch (error) {
  logger.recordError(error, {
    action: 'api_call',
    endpoint: '/api/users',
    method: 'GET',
  });
}
```

## Log Levels

- **DEBUG**: Detailed information for debugging
- **INFO**: General information about app flow
- **WARN**: Warning messages for potential issues
- **ERROR**: Error messages for failures

## Development vs Production

### Development Mode (`__DEV__ = true`)
- Logs to console with timestamps and log levels
- Uses mock Firebase Analytics
- All logs are visible in console

### Production Mode (`__DEV__ = false`)
- Logs to Firebase Analytics
- Console logging is disabled
- Analytics data is sent to Firebase

## Firebase Analytics Integration

The logger automatically integrates with Firebase Analytics in production mode. Make sure to:

1. Install Firebase Analytics:
   ```bash
   npm install @react-native-firebase/analytics
   ```

2. Initialize Firebase Analytics in your app:
   ```typescript
   import { initializeFirebaseAnalytics } from '#root/services/analytics';
   
   // Initialize in your app startup
   await initializeFirebaseAnalytics();
   ```

## Examples

See `logger-examples.ts` for comprehensive usage examples.

## API Reference

### Methods

- `logEvent(eventName: string, parameters?: Record<string, any>)` - Log custom events
- `logData(data: Record<string, any>)` - Log user data
- `recordError(error: Error, context?: Record<string, any>)` - Record errors
- `log(message: string, data?: any, level?: LogLevel)` - General logging
- `error(message: string, error: Error)` - Error logging
- `warn(message: string, data?: any)` - Warning logging
- `info(message: string, data?: any)` - Info logging
- `debug(message: string, data?: any)` - Debug logging

### LogLevel Enum

```typescript
enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}
```





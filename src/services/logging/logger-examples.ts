import { LogLevel, logger } from './logger';

// Example usage of the logger system

export const loggerExamples = {
  // Example 1: Log a custom event
  logUserAction: () => {
    logger.logEvent('user_button_click', {
      button_name: 'login',
      screen: 'auth',
      timestamp: Date.now(),
    });
  },

  // Example 2: Log user data
  logUserProfile: () => {
    logger.logData({
      user_id: '12345',
      age: 25,
      preferences: {
        theme: 'dark',
        language: 'en',
      },
    });
  },

  // Example 3: Record an error
  logApiError: () => {
    const error = new Error('API request failed');
    logger.recordError(error, {
      endpoint: '/api/users',
      method: 'GET',
      status_code: 500,
    });
  },

  // Example 4: Different log levels
  logWithLevels: () => {
    logger.debug('Debug message', { step: 'initialization' });
    logger.info('Info message', { user: 'john_doe' });
    logger.warn('Warning message', { deprecated_feature: 'old_api' });
    logger.error('Error message', new Error('Something went wrong'));
  },

  // Example 5: General logging
  logGeneral: () => {
    logger.log('General message', { data: 'some_value' });
    logger.log('Custom level message', { data: 'value' }, LogLevel.WARN);
  },
};

// Example usage in a React component
export const useLoggerExample = () => {
  const handleLogin = () => {
    try {
      // Your login logic here
      logger.logEvent('user_login_attempt', {
        method: 'email',
        timestamp: Date.now(),
      });

      // Simulate success
      logger.logEvent('user_login_success', {
        user_id: '12345',
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.recordError(error as Error, {
        action: 'login',
        method: 'email',
      });
    }
  };

  const handleUserDataUpdate = (userData: Record<string, unknown>) => {
    logger.logData(userData);
  };

  return {
    handleLogin,
    handleUserDataUpdate,
  };
};

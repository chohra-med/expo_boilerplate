import { useNavigation } from '@react-navigation/native';
import type React from 'react';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { logger } from '#root/services/logging';
import { SafeArea } from '#root/ui/components';
import { LoginForm } from '../components/login-form';
import { useAuth } from '../hooks/use-auth';
import type { LoginFormData } from '../types';

export const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const _navigation = useNavigation();

  const handleLoginSuccess = useCallback(
    async (data: LoginFormData) => {
      try {
        logger.logEvent('login_attempt', {
          email: data.email,
          timestamp: Date.now(),
        });

        const result = await login(data);

        logger.logEvent('login_success', {
          email: data.email,
          timestamp: Date.now(),
        });

        return result;
      } catch (error) {
        logger.recordError(error as Error, {
          action: 'login',
          email: data.email,
        });
        throw error;
      }
    },
    [login]
  );

  const handleLoginError = useCallback((error: string) => {
    logger.error('Login failed', new Error(error));
    Alert.alert('Login Error', error);
  }, []);

  const handleForgotPassword = useCallback(() => {
    logger.logEvent('forgot_password_clicked', {
      timestamp: Date.now(),
    });

    // Navigate to forgot password screen
    // For now, we'll just show an alert since we don't have navigation set up
    Alert.alert(
      'Forgot Password',
      'This would navigate to the forgot password screen. For now, just enter any email and password to login.',
      [{ text: 'OK' }]
    );
  }, []);

  return (
    <SafeArea variant="all" backgroundColor="background">
      <LoginForm
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        onForgotPassword={handleForgotPassword}
        isLoading={isLoading}
      />
    </SafeArea>
  );
};

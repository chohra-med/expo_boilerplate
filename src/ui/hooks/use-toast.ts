import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

export interface ToastConfig {
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  position?: 'top' | 'bottom';
}

export type ToastOptions = ToastConfig;
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export const useToast = () => {
  const showToast = useCallback((config: ToastConfig) => {
    const { title, message, type = 'info', duration = 4000, position = 'top' } = config;

    Toast.show({
      type,
      text1: title,
      text2: message,
      visibilityTime: duration,
      position,
    });
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showToast({ title, message, type: 'success' });
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      showToast({ title, message, type: 'error' });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showToast({ title, message, type: 'info' });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (title: string, message?: string) => {
      showToast({ title, message, type: 'warning' });
    },
    [showToast]
  );

  const hideToast = useCallback(() => {
    Toast.hide();
  }, []);

  return {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
  };
};

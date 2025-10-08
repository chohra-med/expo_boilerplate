import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '#root/store/store';
import { useToast } from '#root/ui/hooks';
import { useLoginMutation } from '../api/auth.api';
import { authService } from '../services/auth.service';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthTokens,
  selectIsAuthenticated,
  selectUser,
} from '../store/auth-selector';
import { clearError, loginFailure, loginSuccess, logout, setLoading } from '../store/auth-slice';
import type { LoginCredentials } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const tokens = useAppSelector(selectAuthTokens);

  const [_loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        // Mock authentication - simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock user data
        const mockUser = {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const mockTokens = {
          accessToken: `mock-access-token-${Date.now()}`,
          refreshToken: `mock-refresh-token-${Date.now()}`,
          expiresIn: 3600, // 1 hour
        };

        // Save tokens and user data to secure storage
        await authService.saveTokens(mockTokens);
        await authService.saveUser(mockUser);

        dispatch(
          loginSuccess({
            user: mockUser,
            tokens: mockTokens,
          })
        );

        showSuccess('Login Successful', 'Welcome back!');
        return { success: true };
      } catch (_error: unknown) {
        const errorMessage = 'Login failed. Please try again.';
        dispatch(loginFailure(errorMessage));
        showError('Login Failed', errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [dispatch, showSuccess, showError]
  );

  const handleLogout = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      // Clear local storage
      await authService.clearAuth();

      dispatch(logout());
      showSuccess('Logged Out', 'You have been successfully logged out');
    } catch (_error) {
      // Even if clearing fails, dispatch logout
      dispatch(logout());
    }
  }, [dispatch, showSuccess]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const [savedUser, savedTokens] = await Promise.all([
        authService.getUser(),
        authService.getTokens(),
      ]);

      if (savedUser && savedTokens) {
        dispatch(
          loginSuccess({
            user: savedUser,
            tokens: savedTokens,
          })
        );
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
    }
  }, [dispatch]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || isLoginLoading,
    error,
    tokens,

    // Actions
    login: handleLogin,
    logout: handleLogout,
    clearError: clearAuthError,
    checkAuthStatus,
  };
};

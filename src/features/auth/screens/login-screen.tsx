import type React from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { logger } from "#root/services/logging";
import { SafeArea } from "#root/ui/components";
import { useToast } from "#root/ui/hooks";
import { LoginForm } from "../components/login-form";
import { useAuth } from "../hooks/use-auth";
import type { LoginFormData } from "../types";

/**
 * Login screen component
 * Handles user authentication with email/password
 * Includes forgot password functionality and error handling
 */
export const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showError, showInfo } = useToast();
  const { login, isLoading } = useAuth();

  /**
   * Handles successful login attempt
   * @param data - The login form data
   * @returns Promise with login result
   */
  const handleLoginSuccess = useCallback(
    async (data: LoginFormData) => {
      try {
        logger.logEvent("login_attempt", {
          email: data.email,
          timestamp: Date.now(),
        });

        const result = await login(data);

        logger.logEvent("login_success", {
          email: data.email,
          timestamp: Date.now(),
        });

        return result;
      } catch (error) {
        logger.recordError(error as Error, {
          action: "login",
          email: data.email,
        });
        throw error;
      }
    },
    [login]
  );

  /**
   * Handles login error and shows toast notification
   * @param error - The error message
   */
  const handleLoginError = useCallback(
    (error: string) => {
      logger.error("Login failed", new Error(error));
      showError(t("auth.loginErrorTitle"), error);
    },
    [showError, t]
  );

  /**
   * Handles forgot password action
   * Shows info toast since navigation is not implemented yet
   */
  const handleForgotPassword = useCallback(() => {
    logger.logEvent("forgot_password_clicked", {
      timestamp: Date.now(),
    });

    // Navigate to forgot password screen
    // For now, we'll just show an info toast since we don't have navigation set up
    showInfo(t("auth.forgotPasswordTitle"), t("auth.forgotPasswordMessage"));
  }, [showInfo, t]);

  return (
    <SafeArea>
      <LoginForm
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        onForgotPassword={handleForgotPassword}
        isLoading={isLoading}
      />
    </SafeArea>
  );
};

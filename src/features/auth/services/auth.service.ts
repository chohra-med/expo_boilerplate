import { secureStorage } from "#root/services/storage/secure-storage";
import type { AuthTokens, User } from "../types";

class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      await secureStorage.setItem("auth_tokens", JSON.stringify(tokens));
    } catch (error) {
      console.error("Failed to save auth tokens:", error);
      throw new Error("Failed to save authentication tokens");
    }
  }

  async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokensString = await secureStorage.getItem("auth_tokens");
      if (!tokensString) return null;
      return JSON.parse(tokensString) as AuthTokens;
    } catch (error) {
      console.error("Failed to get auth tokens:", error);
      return null;
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      await secureStorage.setItem("auth_user", JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user data:", error);
      throw new Error("Failed to save user data");
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userString = await secureStorage.getItem("auth_user");
      if (!userString) return null;
      return JSON.parse(userString) as User;
    } catch (error) {
      console.error("Failed to get user data:", error);
      return null;
    }
  }

  async clearAuth(): Promise<void> {
    try {
      await Promise.all([
        secureStorage.removeItem("auth_tokens"),
        secureStorage.removeItem("auth_user"),
      ]);
    } catch (error) {
      console.error("Failed to clear auth data:", error);
      throw new Error("Failed to clear authentication data");
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const [tokens, user] = await Promise.all([this.getTokens(), this.getUser()]);
      return !!(tokens && user);
    } catch (error) {
      console.error("Failed to check authentication status:", error);
      return false;
    }
  }
}

export const authService = AuthService.getInstance();

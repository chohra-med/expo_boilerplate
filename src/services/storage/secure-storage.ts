import * as SecureStore from "expo-secure-store";

class SecureStorageService {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Failed to save item ${key}:`, error);
      throw new Error(`Failed to save secure item: ${key}`);
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw new Error(`Failed to remove secure item: ${key}`);
    }
  }

  async clear(): Promise<void> {
    try {
      // Note: SecureStore doesn't have a clear all method
      // This would need to be implemented by tracking keys
      console.warn("SecureStore clear not implemented - use removeItem for specific keys");
    } catch (error) {
      console.error("Failed to clear secure storage:", error);
      throw new Error("Failed to clear secure storage");
    }
  }
}

export const secureStorage = new SecureStorageService();

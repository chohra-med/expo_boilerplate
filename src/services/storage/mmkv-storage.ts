import { createMMKV } from "react-native-mmkv";

const mmkv = createMMKV({
  id: "mobile-launcher-storage",
  encryptionKey: "mobile-launcher-encryption-key",
});

// Storage interface for Redux Persist
export const mmkvStorage = {
  setItem: (key: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      try {
        mmkv.set(key, value);
        resolve();
      } catch (error) {
        console.error("MMKV setItem error:", error);
        resolve();
      }
    });
  },

  getItem: (key: string): Promise<string | null> => {
    return new Promise((resolve) => {
      try {
        const value = mmkv.getString(key);
        resolve(value || null);
      } catch (error) {
        console.error("MMKV getItem error:", error);
        resolve(null);
      }
    });
  },

  removeItem: (key: string): Promise<void> => {
    return new Promise((resolve) => {
      try {
        mmkv.remove(key);
        resolve();
      } catch (error) {
        console.error("MMKV removeItem error:", error);
        resolve();
      }
    });
  },

  clear: (): Promise<void> => {
    return new Promise((resolve) => {
      try {
        mmkv.clearAll();
        resolve();
      } catch (error) {
        console.error("MMKV clear error:", error);
        resolve();
      }
    });
  },
};

export { mmkv };

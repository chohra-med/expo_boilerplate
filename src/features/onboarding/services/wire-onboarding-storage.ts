import { createMMKV } from "react-native-mmkv";
import type { WireOnboardingStorage } from "wireai-onboarding";

/**
 * MMKV-backed storage adapter for the Wire AI onboarding kit.
 *
 * The kit persists ONLY its own session-correlation id (never answers) so an app
 * kill mid-onboarding resumes the same backend session instead of minting a new
 * one (keeping the analytics funnel honest). It expects the AsyncStorage-compatible
 * subset — `getItem` / `setItem` / `removeItem` — which we satisfy with a small,
 * dedicated MMKV instance (kept separate from the redux-persist store).
 */
const mmkv = createMMKV({ id: "wire-onboarding-storage" });

export const wireOnboardingStorage: WireOnboardingStorage = {
  getItem: (key: string): Promise<string | null> => {
    return new Promise((resolve) => {
      try {
        resolve(mmkv.getString(key) ?? null);
      } catch {
        resolve(null);
      }
    });
  },

  setItem: (key: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      try {
        mmkv.set(key, value);
      } catch {
        // best-effort — persistence must never break onboarding
      }
      resolve();
    });
  },

  removeItem: (key: string): Promise<void> => {
    return new Promise((resolve) => {
      try {
        mmkv.remove(key);
      } catch {
        // best-effort
      }
      resolve();
    });
  },
};

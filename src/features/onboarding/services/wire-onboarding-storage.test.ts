// The adapter builds its OWN dedicated MMKV instance at import time (deliberately
// separate from the redux-persist store), so the global `createMMKV` mock in
// jest.setup.js gives us a fresh object we cannot reach. Re-mock here and hand back
// one stable instance, then read it off the factory's recorded result.
jest.mock("react-native-mmkv", () => {
  const instance = { getString: jest.fn(), set: jest.fn(), remove: jest.fn() };
  return { createMMKV: jest.fn(() => instance) };
});

import { createMMKV } from "react-native-mmkv";
import { wireOnboardingStorage } from "./wire-onboarding-storage";

const mmkv = (createMMKV as unknown as jest.Mock).mock.results[0].value as {
  getString: jest.Mock;
  set: jest.Mock;
  remove: jest.Mock;
};

const FAILURE = new Error("mmkv: storage is full");

describe("wireOnboardingStorage (async MMKV adapter)", () => {
  beforeEach(() => {
    mmkv.getString.mockReset();
    mmkv.set.mockReset();
    mmkv.remove.mockReset();
  });

  describe("the happy path", () => {
    it("resolves the stored string for a present key", async () => {
      mmkv.getString.mockReturnValue("wsess_abc");
      await expect(wireOnboardingStorage.getItem("wireai:session:default")).resolves.toBe(
        "wsess_abc"
      );
      expect(mmkv.getString).toHaveBeenCalledWith("wireai:session:default");
    });

    it("coalesces a missing key (MMKV returns undefined) to null", async () => {
      mmkv.getString.mockReturnValue(undefined);
      // The kit's contract is `string | null`; a bare undefined would break it.
      await expect(wireOnboardingStorage.getItem("never_written")).resolves.toBeNull();
    });

    it("writes through and resolves", async () => {
      await expect(
        wireOnboardingStorage.setItem("wireai:analytics:deviceKey:default", "wdev_x")
      ).resolves.toBeUndefined();
      expect(mmkv.set).toHaveBeenCalledWith("wireai:analytics:deviceKey:default", "wdev_x");
    });

    it("removes and resolves", async () => {
      await expect(
        wireOnboardingStorage.removeItem("wireai:session:default")
      ).resolves.toBeUndefined();
      expect(mmkv.remove).toHaveBeenCalledWith("wireai:session:default");
    });
  });

  // These four are the reason this adapter exists in its current shape. Before kit
  // 0.13.0 every method swallowed its error and resolved as if it had worked, which
  // made a locked / full / permission-denied MMKV indistinguishable from a healthy
  // one. The kit gates the auto-injected `device_key` join key on a write that
  // genuinely SUCCEEDED, so a fabricated success there means a fresh per-launch key
  // on the wire — which corrupts `min_sessions` instead of merely leaving the join
  // empty. A failure has to reach the caller. See the note in the adapter.
  describe("a failing MMKV must REJECT, never fake success", () => {
    it("rejects a failed write instead of resolving", async () => {
      mmkv.set.mockImplementation(() => {
        throw FAILURE;
      });
      await expect(wireOnboardingStorage.setItem("k", "v")).rejects.toThrow(
        "mmkv: storage is full"
      );
    });

    it("rejects a failed read instead of reporting an empty slot", async () => {
      mmkv.getString.mockImplementation(() => {
        throw FAILURE;
      });
      // Resolving `null` here would read as "nothing stored yet", so the kit would
      // mint and re-persist a NEW id on every launch and never know it had failed.
      await expect(wireOnboardingStorage.getItem("k")).rejects.toThrow(FAILURE);
    });

    it("rejects a failed remove instead of resolving", async () => {
      mmkv.remove.mockImplementation(() => {
        throw FAILURE;
      });
      await expect(wireOnboardingStorage.removeItem("k")).rejects.toThrow(FAILURE);
    });

    it("still resolves null for a genuinely absent key, so absence stays distinguishable", async () => {
      mmkv.getString.mockReturnValue(undefined);
      await expect(wireOnboardingStorage.getItem("k")).resolves.toBeNull();
    });
  });
});

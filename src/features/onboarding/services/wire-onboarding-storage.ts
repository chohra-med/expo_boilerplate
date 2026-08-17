import type { WireOnboardingStorage } from "@wireai/activation";
import { createMMKV } from "react-native-mmkv";

/**
 * MMKV-backed storage adapter for the Wire AI onboarding kit.
 *
 * The kit persists its own session-correlation id (never answers) so an app kill
 * mid-onboarding resumes the same backend session instead of minting a new one
 * (keeping the analytics funnel honest), plus the per-install `device_key` that
 * joins onboarding to every event the app reports later. It expects the
 * AsyncStorage-compatible subset — `getItem` / `setItem` / `removeItem` — which we
 * satisfy with a small, dedicated MMKV instance (kept separate from the
 * redux-persist store). The SAME instance is handed to analytics and lifecycle, so
 * all three surfaces share one id.
 *
 * ── WHY THESE METHODS REJECT INSTEAD OF SWALLOWING (0.13.0) ───────────────────
 * This adapter used to catch every MMKV error and resolve as if the call had
 * worked: `setItem` swallowed and resolved `void`, `getItem` swallowed and
 * resolved `null`. That reads as defensive, and it is the opposite.
 *
 * Since 0.13.0 the kit decides whether it may put an auto-minted `device_key` on
 * the wire by asking whether the write actually SUCCEEDED — it grants
 * `IdentityRecord.durable` only when a persisted id was read back or a `setItem`
 * RESOLVED (`node_modules/@wireai/activation/src/context/deviceId.ts:162-176`),
 * and `<WireOnboarding>` injects the join key only on `durable`
 * (`node_modules/@wireai/activation/src/WireOnboarding.tsx:182`). An adapter that
 * reports success unconditionally makes that gate inert: a locked / full /
 * permission-denied MMKV looks identical to a healthy one, so the kit persists
 * nothing, mints a fresh `wdev_*` on every launch, and injects it. A per-launch
 * join key is worse than none — the server counts `min_sessions` by distinct opens
 * grouped on `device_key`, so it corrupts that counter instead of leaving it empty.
 *
 * Rejecting is safe: EVERY kit consumer of this adapter already catches. The
 * session read is wrapped in try/catch (`session/persistedSession.ts:99-103`), and
 * every write is fire-and-forget with `.catch(() => {})` (`persistedSession.ts:137`,
 * `permissions/permissionMemory.ts:72`, `analytics/eventQueue.ts:286`,
 * `session-analytics/lifecycle.ts:193`). So a failing device still onboards
 * normally — the kit just declines the join key and says why in a dev warning,
 * which is the outcome you want, because it is the true one.
 *
 * The rule to take away: a storage seam must report what really happened. Faking
 * success does not make persistence more reliable, it only removes everything
 * downstream's ability to notice that it failed.
 */
const mmkv = createMMKV({ id: "wire-onboarding-storage" });

export const wireOnboardingStorage: WireOnboardingStorage = {
  // `async` on a synchronous MMKV call is deliberate: the kit's interface is
  // promise-based, and an async function turns a native throw into a REJECTED
  // promise, which is exactly the signal the durability gate reads.
  getItem: async (key: string): Promise<string | null> => mmkv.getString(key) ?? null,

  setItem: async (key: string, value: string): Promise<void> => {
    mmkv.set(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    mmkv.remove(key);
  },
};

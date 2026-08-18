/**
 * wire-gate-storage — the SYNCHRONOUS bookkeeping store the kit's gates count with.
 *
 * @description The review gate and the questionnaire gate both need a SYNC key/value store:
 * their "have I already shown this?" verdict has to resolve DURING render, or a popup flashes
 * for a frame before the gate says "seen". The kit types that store structurally
 * (`{ getItem, setItem }`), so this factory hardens ANY sync backend into it.
 *
 * ## Why this is a factory and not a concrete store
 * This file is in the SHARED layer that propagates to every launcher tier, and the tiers do not
 * agree on a sync backend: the paid tiers ship `react-native-mmkv` (natively sync), while the
 * public Lite tier deliberately ships none of it because MMKV cannot load under Expo Go. So the
 * BACKEND is injected by each app and only the SEMANTICS live here.
 *
 * ## The semantics, and why they differ from the onboarding adapter
 * Both methods SWALLOW failures, and that is deliberate — do not "fix" it to match
 * `wire-onboarding-storage.ts`, which rejects on purpose. The two adapters fail in opposite
 * directions because their failure modes are opposite:
 *   - The onboarding adapter feeds the kit's DEVICE KEY durability check. A swallowed write
 *     there tells the kit an id was persisted when it was not, so the kit injects a fresh
 *     device key every launch and the server's per-device session count can never exceed 1.
 *     Failing loud there is the only honest answer.
 *   - This store feeds a session COUNTER behind a fail-closed `minSessions` floor. A failed
 *     read here pins the counter low, so the gate stays SHUT. That fails closed: the worst case
 *     is a prompt that never fires, never a prompt that ambushes a first-run user.
 *
 * A throwing backend must therefore never propagate out of here.
 *
 * @example
 * ```typescript
 * // Per-app binding (NOT in the shared layer — MMKV is not in every tier):
 * const mmkv = createMMKV({ id: 'wire-gate-storage' });
 * export const wireGateStorage = createWireGateStorage({
 *   read: (key) => mmkv.getString(key) ?? null,
 *   write: (key, value) => mmkv.set(key, value),
 * });
 * ```
 */

/** The minimal SYNC backend a host binds — one read, one write, both allowed to throw. */
export interface WireGateStorageBackend {
  /** Read a key. Return `null`/`undefined` for a miss. May throw; the wrapper catches. */
  read: (key: string) => string | null | undefined;
  /** Write a key. May throw; the wrapper catches. */
  write: (key: string, value: string) => void;
}

/**
 * The shape the kit's gates accept for their `storage` prop (the kit's `CoachmarkStorage`).
 * Declared structurally so this app-agnostic layer never imports the `coachmarks` subpath —
 * a UI subpath with optional native peers (`react-native-reanimated` today; `expo-blur` too
 * before kit 0.14.2 made it lazy) that the shared layer must not drag into every tier.
 */
export interface WireGateStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

/**
 * Harden a sync backend into the gate storage the kit expects.
 *
 * @param backend The app's sync key/value backend (MMKV, an AsyncStorage mirror, a Map).
 * @returns A never-throwing `{ getItem, setItem }`. A failed read answers `null` (gate stays
 * shut); a failed write is dropped (the gate may re-evaluate next launch).
 */
export const createWireGateStorage = (backend: WireGateStorageBackend): WireGateStorage => ({
  getItem: (key: string): string | null => {
    try {
      return backend.read(key) ?? null;
    } catch {
      // Fail-closed: an unreadable counter reads as "not enough sessions yet".
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      backend.write(key, value);
    } catch {
      // Best-effort — gate bookkeeping must never break the screen it sits on.
    }
  },
});

/**
 * An in-memory gate storage, for tiers or tests with no persistent sync backend.
 *
 * @description Real storage is strongly preferred: an in-memory counter resets on every app
 * kill, so a `minSessions` floor takes longer to reach. It is still much better than passing
 * NO storage at all, which makes the kit warn (dev-only) that the counter is pinned at 1 and
 * the gate can therefore never fire.
 *
 * @returns A gate storage backed by a `Map` that lives for the process.
 */
export const createInMemoryGateStorage = (): WireGateStorage => {
  const memory = new Map<string, string>();
  return createWireGateStorage({
    read: (key) => memory.get(key) ?? null,
    write: (key, value) => {
      memory.set(key, value);
    },
  });
};

import type { CoachmarkStorage } from "wireai-onboarding/coachmarks";
import { mmkv } from "./mmkv-storage";

/**
 * SYNCHRONOUS MMKV adapter for the Wire coachmark / feature-showcase engine.
 *
 * Why sync (and separate from `mmkvStorage`): a coachmark's "already seen?" gate
 * must resolve DURING render — an async read would let a ring flash on screen for
 * a frame before the gate says "seen". MMKV reads/writes are synchronous, so this
 * is a 2-method wrapper over the same encrypted instance the rest of the app uses.
 *
 * The kit persists only tiny seen-flags through this (`wire_coachmark_<tourId>_seen`,
 * `wire_showcase_<id>_seen`) — no user data. It is intentionally distinct from the
 * async `WireOnboardingStorage` used for session-id persistence.
 */
export const coachmarkStorage: CoachmarkStorage = {
  getItem: (key: string): string | null => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string): void => {
    mmkv.set(key, value);
  },
};

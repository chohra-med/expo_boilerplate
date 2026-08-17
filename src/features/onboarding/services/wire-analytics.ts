import type { WireUserContext } from "@wireai/activation";
import { wireConfigFromEnv } from "@wireai/activation";
import { type Analytics, createAnalytics } from "@wireai/activation/analytics";
import { wireOnboardingStorage } from "./wire-onboarding-storage";

/**
 * Wire AI analytics — the rich user-context EXAMPLE.
 *
 * This is the second half of the `@wireai/activation` integration: the onboarding
 * screen shows the AI flow, this shows how to feed the activation analytics the
 * context that lets you segment WHO onboarded and on WHAT device.
 *
 * `createAnalytics` returns a Segment/PostHog-shaped surface (`track` / `screen` /
 * `identify` / `setUserContext`) over the kit's own offline-first queue — no second
 * SDK, no second key. It reuses the SAME `{ serverUrl, apiKey }` as onboarding (via
 * `wireConfigFromEnv`) and the SAME MMKV storage seam as the onboarding session, so
 * events survive being offline and an app kill.
 *
 * WHAT THE KIT AUTO-PROVIDES — you do NOT set these:
 *   • device (form factor + iOS model), `app_version`, and the per-install
 *     `device_key` the kit mints and persists for you.
 *
 * ⚠️ `device_key` is auto-minted, but it is only STABLE across launches if this
 * storage adapter actually persists it (kit 0.13.0 made that distinction real —
 * see `wire-onboarding-storage.ts`). It is the same id the onboarding screen's
 * auto-join injects: one process-wide registry keyed by `appId`, one MMKV slot
 * (`wireai:analytics:deviceKey:<appId>`), so onboarding and analytics land in ONE
 * id space and the `activated` funnel can actually join them. That only holds
 * while all three Wire surfaces share this storage instance and this `appId` —
 * splitting either one splits the funnel, silently.
 *
 * WHAT YOU SET (the app-specific identity) — see `setWireUserContext` + `use-auth.ts`:
 *   • `userId`    your app's OPAQUE user id (NOT the email).
 *   • `userEmail` OPT-IN PII (see the consent note on `setWireUserContext`).
 *   • `extra`     any custom cohort dimensions (plan/tier/locale…), namespaced `custom.*`.
 *
 * GATING: identical to onboarding — when no Wire key is set (a fresh clone),
 * `wireConfigFromEnv()` is `null`, `wireAnalytics` is `null`, and every helper is a
 * no-op. Add a free Wire key to `.env` to light it up. Zero setup required.
 */
const config = wireConfigFromEnv();

export const wireAnalytics: Analytics | null = config
  ? createAnalytics({
      serverUrl: config.serverUrl,
      apiKey: config.apiKey,
      appId: config.appId,
      // Reuse the onboarding MMKV seam so pending events persist across an app kill.
      storage: wireOnboardingStorage,
      // Seeded ONCE here at init. `device_key` + `app_version` auto-fill, so the only
      // thing missing is the user's identity — unknown until login. Attach it then via
      // `setWireUserContext` (see `handleLogin` in `../../auth/hooks/use-auth.ts`).
      userContext: {
        // extra: { plan: "free" }, // ← example: a custom cohort dimension, if you have one
      },
    })
  : null;

/**
 * Attach / update the rich user-context after init — call this at login (and on
 * session restore) so every subsequent activation event carries who the user is.
 * Shallow-merges over the current context (`extra` deep-merges); a supplied `userId`
 * also binds like `identify`. No-op until a Wire key is configured.
 *
 * ⚠️ PII / consent: `userEmail` is personal data (GDPR — EU users). Only pass it once
 * the user has consented. By default the RAW email is sent (the server stores it; the
 * console shows only its hash). To send ONLY a hash FROM the device, pass
 * `hashEmail: true` alongside `userEmail`.
 */
export const setWireUserContext = (partial: Partial<WireUserContext>): void => {
  wireAnalytics?.setUserContext(partial);
};

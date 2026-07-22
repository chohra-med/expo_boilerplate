import type { LifecycleConfig } from "@wireai/activation";
import { wireConfigFromEnv } from "@wireai/activation";
import { wireOnboardingStorage } from "./wire-onboarding-storage";

/**
 * Wire AI lifecycle events — the funnel DENOMINATOR.
 *
 * `useLifecycleEvents` (mounted ONCE at the app root — see `src/entrypoints/app.tsx`)
 * fires `app.first_open` (once ever, per install) + `app.session_started` (once per
 * open). These two events are the funnel denominator: without them a Wire tenant has
 * nothing to divide by, so activation and retention are unrankable rates.
 *
 * This config reuses the SAME `{ serverUrl, apiKey, appId }` as onboarding (via
 * `wireConfigFromEnv`) and the SAME MMKV storage seam as the onboarding session, so
 * the once-ever first-open flag survives an app kill and lifecycle events buffer
 * offline — no second SDK, no second key.
 *
 * GATING: identical to onboarding + analytics — when no Wire key is set (a fresh
 * clone), `wireConfigFromEnv()` is `null`, this is `undefined`, and the hook no-ops.
 * Add a free Wire key to `.env` to light it up. Zero setup required.
 */
const config = wireConfigFromEnv();

export const wireLifecycleConfig: LifecycleConfig | undefined = config
  ? {
      serverUrl: config.serverUrl,
      apiKey: config.apiKey,
      appId: config.appId,
      // Reuse the onboarding MMKV seam: persists the once-ever first-open flag and
      // buffers lifecycle events across an app kill.
      storage: wireOnboardingStorage,
    }
  : undefined;

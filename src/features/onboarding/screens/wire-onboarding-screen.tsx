import {
  isOnboardingEnabled,
  type OnboardingEvent,
  type OnboardingResult,
  WireOnboarding,
  wireConfigFromEnv,
} from "@wireai/activation";
import type { ShowcaseSlide } from "@wireai/activation/showcase";
import { FeatureShowcase } from "@wireai/activation/showcase";
import type React from "react";
import { useCallback, useState } from "react";
import { analytics, EVENTS } from "#root/analytics";
import { getWirePermissionScreens } from "#root/features/wire";
import { logger } from "#root/services/logging";
import { useAppDispatch } from "#root/store/store";
import { Box } from "#root/ui/components";
import { useTheme } from "#root/ui/style/theme-provider";
import { APP_SHOWCASE, selectAppShowcaseSlides } from "../config";
import { wireOnboardingStorage } from "../services/wire-onboarding-storage";
import { completeOnboarding } from "../store/onboarding-slice";
import { OnboardingScreen as StaticOnboardingScreen } from "./onboarding-screen";

/**
 * Onboarding entry point — AI-driven by default, static as a guaranteed fallback.
 *
 * When a Wire AI key is configured (`EXPO_PUBLIC_WIREAI_API_KEY` + `_SERVER_URL`),
 * this renders the Wire AI dynamic onboarding. The kit's `fallbackFlow` is the
 * SAME static questionnaire this boilerplate has always shipped, so a backend /
 * generation error degrades to the static flow instead of breaking onboarding.
 *
 * ⚠️ That last sentence only became TRUE at kit 0.13.3. On the default
 * `maxRetries={1}` the retry never re-armed, so a backend that hung at start left
 * the user on the loading screen FOREVER and `fallbackFlow` was unreachable. The
 * defaults now mean what they say (`1` → two kickoff attempts, then the fallback),
 * which is why this screen passes no `maxRetries` / `startTimeoutMs` of its own.
 *
 * When no key is set (a fresh clone), `isOnboardingEnabled()` is false and the
 * static flow renders unchanged — zero setup required. Add a free Wire key to
 * upgrade the exact same screen to AI onboarding.
 */
const _appId = process.env.EXPO_PUBLIC_WIREAI_APP_ID ?? "default";

export const WireOnboardingScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

  // App-intro showcase (@wireai/activation/showcase), rendered as a PERSONALIZED
  // VALUE BRIDGE *after* onboarding completes: 2-3 slides picked from the user's
  // answers (see `select-showcase-slides.ts`). `null` = onboarding not finished yet;
  // a slide array = play the bridge, then enter the app. The kit still gates it once
  // (`wire_showcase_<id>_seen`) — if already seen it calls `onDone` from an effect.
  const [bridgeSlides, setBridgeSlides] = useState<ShowcaseSlide[] | null>(null);

  const handleComplete = useCallback((result: OnboardingResult) => {
    analytics.track(EVENTS.ONB_COMPLETE);
    // Personalize the value bridge from what the user just told us (full deck when
    // the answers are too thin to match — see selectAppShowcaseSlides). We DON'T
    // dispatch completeOnboarding yet: that leaves this screen, so we wait until the
    // bridge is done (handleBridgeDone).
    setBridgeSlides(selectAppShowcaseSlides(APP_SHOWCASE.slides, result.answers));
  }, []);

  // Value bridge finished (or was already seen) → now finish onboarding for real.
  const handleBridgeDone = useCallback(() => {
    dispatch(completeOnboarding());
  }, [dispatch]);

  const handleSkip = useCallback(() => {
    analytics.track(EVENTS.ONB_ABANDONED);
    // User bailed — no answers to personalize from, so skip the bridge and finish.
    dispatch(completeOnboarding());
  }, [dispatch]);

  const handleError = useCallback((err: unknown) => {
    logger.error(
      "[WireOnboarding] flow error",
      err instanceof Error ? err : new Error(String(err))
    );
  }, []);

  const handleEvent = useCallback((event: OnboardingEvent) => {
    logger.logEvent("wire_onboarding_event", { event_type: event.type });
  }, []);

  // After onboarding completes we hold the personalized slides — play the value
  // bridge, then enter the app. The kit gates it to run at most once.
  if (bridgeSlides) {
    return (
      <FeatureShowcase
        config={{ ...APP_SHOWCASE, slides: bridgeSlides }}
        accentColor={theme.colors.primary}
        onDone={handleBridgeDone}
      />
    );
  }

  const config = isOnboardingEnabled() ? wireConfigFromEnv({ appId: _appId }) : null;

  // No key configured (or explicitly disabled) → render the static flow unchanged,
  // with NO app-intro slides. The showcase is a Wire-onboarding upgrade, so a
  // keyless fresh clone shows the static questionnaire only (README promise).
  if (!config) {
    return <StaticOnboardingScreen />;
  }

  return (
    <Box flex={1}>
      <WireOnboarding
        config={config}
        // `storage` does TWO jobs, and the second one is the whole funnel.
        //
        // 1. RESUME: persists the session-correlation id, so an app kill mid-flow
        //    resumes the same backend session instead of counting a phantom drop.
        // 2. THE JOIN KEY: since kit 0.12.2 a `storage` prop also lets the kit
        //    auto-inject `user_context.device_key` — the ONLY thing that stitches
        //    this onboarding session to every event the app reports later. Without
        //    it the `activated` funnel reads a silent zero, which is how two of
        //    three production integrations shipped.
        //
        // We deliberately pass NO `userContext` here. This app owns no device id of
        // its own, and the key the kit mints is the SAME one `wire-analytics.ts` and
        // `wire-lifecycle.ts` stamp (one process-wide registry, namespaced by
        // `appId`, persisted in the MMKV instance all three share) — so the join is
        // already correct. Hand-writing `userContext={{ deviceKey }}` would produce a
        // bucket the server does not read; if you ever DO own a device id, pass it as
        // `userContext={activationJoinContext(yourDeviceKey)}` and it wins verbatim.
        //
        // ⚠️ The auto-join only fires if the adapter really persists. Since 0.13.0
        // the kit gates injection on a write that SUCCEEDED, not on the prop being
        // present — which is why `wire-onboarding-storage.ts` rejects on failure
        // instead of pretending. Read the note there before you "harden" it.
        storage={wireOnboardingStorage}
        // Mid-flow OS-permission priming screens. EMPTY on this Lite template (it ships no
        // permissions module), so the flow is unchanged — inject a handler in
        // `features/wire/config/wire-permission-screens.ts` to enable notification priming.
        permissionScreens={getWirePermissionScreens()}
        fallbackFlow={<StaticOnboardingScreen />}
        onComplete={handleComplete}
        onSkip={handleSkip}
        onError={handleError}
        onEvent={handleEvent}
      />
    </Box>
  );
};

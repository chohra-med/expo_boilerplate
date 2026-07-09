import type React from "react";
import { useCallback, useState } from "react";
import {
  isOnboardingEnabled,
  type OnboardingEvent,
  type OnboardingResult,
  WireOnboarding,
  wireConfigFromEnv,
} from "wireai-onboarding";
import { FeatureShowcase } from "wireai-onboarding/showcase";
import { analytics, EVENTS } from "#root/analytics";
import { logger } from "#root/services/logging";
import { useAppDispatch } from "#root/store/store";
import { Box } from "#root/ui/components";
import { useTheme } from "#root/ui/style/theme-provider";
import { APP_SHOWCASE } from "../config";
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
 * When no key is set (a fresh clone), `isOnboardingEnabled()` is false and the
 * static flow renders unchanged — zero setup required. Add a free Wire key to
 * upgrade the exact same screen to AI onboarding.
 */
const _appId = process.env.EXPO_PUBLIC_WIREAI_APP_ID ?? "default";

export const WireOnboardingScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

  // App-intro showcase (wireai-onboarding/showcase): 3 static slides shown ONCE
  // before onboarding starts. The kit gates it via the shared coachmark storage
  // (`wire_showcase_<id>_seen`) — if already seen it renders nothing and calls
  // `onDone` from an effect, so this state simply advances to the flow below.
  const [showcaseDone, setShowcaseDone] = useState(false);
  const handleShowcaseDone = useCallback(() => setShowcaseDone(true), []);

  const handleComplete = useCallback(
    (_result: OnboardingResult) => {
      analytics.track(EVENTS.ONB_COMPLETE);
      dispatch(completeOnboarding());
    },
    [dispatch]
  );

  const handleSkip = useCallback(() => {
    analytics.track(EVENTS.ONB_ABANDONED);
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

  const config = isOnboardingEnabled() ? wireConfigFromEnv({ appId: _appId }) : null;

  // No key configured (or explicitly disabled) → render the static flow unchanged,
  // with NO app-intro slides. The showcase is a Wire-onboarding upgrade, so a
  // keyless fresh clone shows the static questionnaire only (README promise).
  if (!config) {
    return <StaticOnboardingScreen />;
  }

  // Show the app-intro slides first; the kit gates them to run at most once.
  if (!showcaseDone) {
    return (
      <FeatureShowcase
        config={APP_SHOWCASE}
        accentColor={theme.colors.primary}
        onDone={handleShowcaseDone}
      />
    );
  }

  return (
    <Box flex={1}>
      <WireOnboarding
        config={config}
        storage={wireOnboardingStorage}
        fallbackFlow={<StaticOnboardingScreen />}
        onComplete={handleComplete}
        onSkip={handleSkip}
        onError={handleError}
        onEvent={handleEvent}
      />
    </Box>
  );
};

import { DemoOnboarding } from "@wireai/activation";
import type React from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { logger } from "#root/services/logging";
import { getWireConfig } from "#root/services/wire";

/**
 * Wire AI dev/QA trigger — runs the real onboarding flow on demand, in a modal, then closes.
 *
 * @description No loop, no account, no navigation side effects, so it is re-runnable infinitely
 * with the same logged-in user. That is the whole point: the production flow is a once-per-user
 * funnel, and QA-ing a change to it otherwise means wiping the app.
 *
 * ⛔ DEV BUILDS ONLY, and the guard is `__DEV__`, never an env var. `EXPO_PUBLIC_*` values are
 * INLINED AT BUILD TIME, so an env-only gate is baked ON into whatever build was made with the
 * var set and ships to the store. `__DEV__` is the only guard the bundler strips for production.
 *
 * The component returns `null` outside a dev build even though its only current mount is already
 * behind a `__DEV__` check: this is the guard that travels with the component, so a future mount
 * somewhere less careful cannot ship it.
 *
 * With no Wire env configured, `config` is `null` and the kit renders its own "not integrated
 * yet" hint instead of the flow. Nothing crashes and nothing is fetched.
 *
 * @inventory
 */
export const WireDemoOnboarding: React.FC = () => {
  const { t } = useTranslation();
  const config = useMemo(() => getWireConfig(), []);

  const handleComplete = useCallback(() => {
    // The demo deliberately persists nothing. Observed only so a QA run is visible in the log.
    logger.logEvent("wire_demo_onboarding_completed", {});
  }, []);

  if (!__DEV__) {
    return null;
  }

  return (
    <DemoOnboarding
      config={config}
      label={t("wire.demoOnboardingLabel")}
      onComplete={handleComplete}
    />
  );
};

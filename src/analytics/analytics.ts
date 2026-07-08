/**
 * analytics.ts — the typed facade. ONE seam for the whole app.
 *
 * This boilerplate already ships a transport-based logging stack
 * (`#root/services/logging` → console / firebase-analytics / crashlytics
 * transports). This facade does NOT create a second Firebase client — every
 * event, screen view, user id and user property delegates to the unified
 * `logger`, so Crashlytics + the console transport keep working untouched. This
 * module only ADDS a typed, registry-backed surface on top.
 *
 * The single exception is the collection gate (setAnalyticsCollectionEnabled),
 * which has no `logger` seam — it talks to the Firebase Analytics module
 * directly, exactly as `initializeFirebaseAnalytics()` already does at boot.
 *
 * Usage:  import { analytics, EVENTS } from "#root/analytics";
 *         analytics.track(EVENTS.FEATURE_USED, { feature_name: "sample" });
 */

import firebaseAnalytics from "@react-native-firebase/analytics";
import { logger } from "#root/services/logging";
import type { EventName } from "./events";
import { type AnalyticsParams, sanitizeParams } from "./params";

let initialized = false;

/**
 * Set the dev collection gate. Collection is OFF in __DEV__ and ON in
 * production — preserving the boilerplate's existing behavior
 * (initializeFirebaseAnalytics applies the same gate at boot; this keeps the
 * facade self-consistent).
 */
const applyCollectionGate = async (): Promise<void> => {
  try {
    await firebaseAnalytics().setAnalyticsCollectionEnabled(!__DEV__);
  } catch {
    // never let analytics setup break boot
  }
};

export const analytics = {
  /**
   * Call once at app boot (before the first track). Idempotent.
   */
  async init(): Promise<void> {
    if (initialized) {
      return;
    }
    initialized = true;
    await applyCollectionGate();
  },

  /**
   * Track a typed, registry-backed event. Params are sanitized (Firebase
   * limits + PII denylist, `timestamp` stripped) before hitting the transport.
   */
  track(event: EventName, params?: AnalyticsParams): void {
    logger.logEvent(event, sanitizeParams(params));
  },

  /**
   * Track a screen view. Prefer the useScreenTracking() hook — this is the
   * low-level seam it delegates to. Routes through logScreenView so the
   * reserved Firebase `screen_view` is never double-logged as a custom event.
   */
  trackScreen(screenName: string): void {
    logger.logScreenView(screenName, screenName);
  },

  /**
   * Bind the current user to every downstream sink (Firebase / Crashlytics).
   * Call at auth success.
   */
  identify(userId: string): void {
    logger.setUserId(userId);
  },

  /**
   * Clear the user identity across every sink. Call at logout.
   */
  reset(): void {
    logger.setUserId("");
  },

  /**
   * Set a Firebase user property (segmentation axis). Values are clamped to
   * Firebase's 36-char limit; null clears the property. Routed through the
   * logger.setUserProperties seam (the firebase-analytics transport coerces to
   * string | null).
   */
  async setUserProperty(name: string, value: string | null): Promise<void> {
    try {
      const clamped = value === null ? null : value.slice(0, 36);
      logger.setUserProperties({ [name]: clamped });
    } catch {
      // swallow — user properties are best-effort
    }
  },

  /**
   * Manually toggle collection (e.g. a privacy setting). Defaults follow the
   * __DEV__ gate via init().
   */
  async setEnabled(enabled: boolean): Promise<void> {
    try {
      await firebaseAnalytics().setAnalyticsCollectionEnabled(enabled);
    } catch {
      // best-effort
    }
  },
};

export type Analytics = typeof analytics;

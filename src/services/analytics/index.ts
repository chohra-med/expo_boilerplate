/**
 * Analytics Module
 * Central export for the Firebase Analytics + Crashlytics services.
 *
 * NOTE (Lite boilerplate): Crashlytics is the ONLY crash channel here — Sentry
 * is intentionally not included. Prefer the unified logger from
 * `#root/services/logging` for app code; these are the low-level clients the
 * logging transports delegate to.
 */

export { analytics, initializeFirebaseAnalytics } from "./analytics";
export { crashlyticsService, initializeCrashlytics } from "./crashlytics";

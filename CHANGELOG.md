# Changelog

All notable changes to this boilerplate are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- Bumped `@wireai/activation` `^0.8.0` → `^0.10.0` (2026-07-19). The lockfile
  now resolves to exactly `0.10.0`. What the bump brings:
  - the kit-owned event-trigger surface `wire.track()` / `useWireActivation()`
    plus decision revalidation (kit #49);
  - a cross-bundle session singleton
    (`globalThis[Symbol.for("@wireai/activation:currentSessionId")]`) so
    `getCurrentSessionId()` is reliable when the kit runs from `dist`;
  - the 0.9.2 `retainSessionOnComplete` funnel-seed fix (one signup = one
    `session_started`);
  - the 0.9.1 review-decision truth fixes.
  - No consumer code changes required: every symbol this template imports
    (`WireOnboarding`, `wireConfigFromEnv`, `isOnboardingEnabled`,
    `WireOnboardingStorage`, `OnboardingResult`, `OnboardingEvent`, and the
    `@wireai/activation/showcase` + `@wireai/activation/coachmarks` subpath
    exports) is unchanged in 0.10.0. Typecheck, the Jest suite, and the Expo JS
    bundle all pass on the bump.
  - Not adopted in this pass: the new `wire.track()` event API is available but
    intentionally left unwired here (a separate, deliberate follow-up).

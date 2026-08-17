# Changelog

All notable changes to this boilerplate are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- Bumped `@wireai/activation` `^0.11.0` → **`0.13.6`** and `wireai-rn` `^0.2.4` →
  **`0.2.5`** (2026-08-17), both pinned EXACTLY (no caret) with `yarn.lock`
  regenerated in the same commit. `^0.11.0` is a 0.x caret, so it resolved to
  `>=0.11.0 <0.12.0` — the pin is what makes the version readable from
  `package.json` alone.
  (The earlier `^0.10.0` → `^0.11.0` bump shipped without a changelog entry. This
  entry covers the whole `0.11.0 → 0.13.6` range.)

  **What the range brings, in order of how much it bites the default config:**
  - **0.13.3 — the loading screen could hang forever.** `maxRetries` never
    re-armed, so on the DEFAULT `maxRetries={1}` exactly one retry ever fired and
    no terminal state was reached: a backend hung at start gave a 15s loader and
    then a permanent "Getting started…", with `fallbackFlow` unreachable. This
    boilerplate's onboarding screen has always promised "a backend error degrades
    to the static flow" — that promise is only actually kept from this version on.
  - **0.13.3 — a retry could be recorded as the user's first answer.** The
    kickoff payload was keyed on a mount-time prop, so a retry re-sent
    `startMessage` and the server recorded it as the answer to the pending
    question. Only the first attempt of a fresh session sends it now. Stated
    cost: a retry SKIPS a pending card, so the user loses one question.
  - **0.12.2 / 0.13.0 — the `device_key` join key** (see Fixed below).
  - **0.13.5 — `wireDoctor`**, a dev-only integration self-check on
    `@wireai/activation/analytics`. Available, deliberately not wired here yet.
  - **0.13.6 — `OnboardingResult.plan` and `.variant`**, the backend's plan and
    the assigned experiment arm handed to the host uninterpreted. Both keys are
    absent (not `undefined`) when the backend sends neither, so `handleComplete`
    is unaffected. `wireai-rn@0.2.5` is what surfaces the extra DataPart the
    `plan` read needs; `0.2.4` simply reads no plan.
  - `DoneBlock` and `RESERVED_USER_CONTEXT_KEYS` were removed in 0.13.0. Neither
    is referenced anywhere in `src/` — verified, no action needed.
  - No import site changed. All six `@wireai/activation` subpaths this template
    uses (root, `/showcase`, `/analytics`, `/coachmarks`) still resolve, and the
    `selectTourSteps` mock in `src/config/coachmarks.test.ts` still mirrors the
    real 0.13.6 contract exactly.

### Fixed

- **The Wire onboarding storage adapter now reports failure instead of faking
  success** (`src/features/onboarding/services/wire-onboarding-storage.ts`).
  Every method used to swallow its MMKV error and resolve as if the call had
  worked. Since kit 0.13.0 that is actively harmful: the kit decides whether it
  may auto-inject `user_context.device_key` — the only thing that joins an
  onboarding session to everything the app reports later — by asking whether the
  write actually SUCCEEDED, not whether a `storage` prop was passed. An adapter
  that always reports success makes that gate inert, so a locked / full /
  permission-denied MMKV silently produces a NEW join key on every launch, which
  corrupts the server's `min_sessions` counter instead of merely leaving the join
  empty. `getItem` / `setItem` / `removeItem` now reject on a real failure; every
  kit consumer already catches, so onboarding still never breaks. Covered by
  `wire-onboarding-storage.test.ts` (8 tests; the three rejection cases fail
  against the old adapter).

- **Stale comments corrected.** `wire-analytics.ts` credited the auto-minted
  `device_key` to "(0.8.0)" and described it as unconditionally stable; stability
  has depended on the storage adapter since 0.13.0. The onboarding screen now
  documents what `storage` actually buys (session resume AND the join key) and
  why no `userContext` is passed here.

### Changed (earlier)

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

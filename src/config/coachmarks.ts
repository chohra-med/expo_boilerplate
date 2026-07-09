/**
 * coachmarks.ts — the app's guided-tour "feature map".
 *
 * This is the ONE place you declare which UI elements get a coachmark, what each
 * one says, and where it lives. The kit (`wireai-onboarding/coachmarks`) owns the
 * animation, blur spotlight, ring, gesture hand, measuring, and one-overlay queue;
 * the app only declares WHERE things anchor and WHICH tour plays.
 *
 * ── The feature-map convention ────────────────────────────────────────────────
 * Each entry is a `CoachmarkFeature`: a kit `CoachmarkStep` plus a `screen` label
 * so the catalog reads as documentation ("this coachmark lives on Home"). Every
 * entry has a STABLE `id` — that id is the anchor lookup key, the analytics name,
 * and (later) the token the AI selects on. Give a step an `anchorId` to ring a
 * specific element; omit it for a centered, target-less hint (e.g. a scroll cue).
 *
 * ── The AI-selection upgrade path (drop-in, zero rewire) ──────────────────────
 * Today the whole catalog plays in declared order via `selectTourSteps(catalog)`.
 * LATER, the Wire backend emits an ordered `coachmarks: string[]` id list chosen
 * from a user's captured onboarding intent; you pass it straight through as
 * `selectTourSteps(catalog, plan.coachmarks)` and nothing else changes — same
 * contract, AI is a drop-in. Building the tour through `selectTourSteps` now is
 * what makes that upgrade a one-liner.
 */

import type { CoachmarkStep } from "wireai-onboarding/coachmarks";
import { selectTourSteps } from "wireai-onboarding/coachmarks";

/**
 * QA replay flag. Wired into `<CoachmarkProvider isTestingCoachmark={...}>`.
 *
 * When `true`, every "seen" gate reads as unseen AND every "seen" write is
 * suppressed, so every tour and the feature showcase replay on each app launch —
 * one boolean re-sees the whole coachmark surface. Ship it `false`; flip it to
 * `true` locally (or gate on `__DEV__`) while QA'ing the tours.
 */
export const IS_TESTING_COACHMARK = __DEV__ && false;

/** Gate key + analytics prefix for the first-run home tour. */
export const HOME_TOUR_ID = "boilerplate_home_tour";

/** A `CoachmarkStep` annotated with the screen it belongs to (docs + AI routing). */
export interface CoachmarkFeature extends CoachmarkStep {
  /** Human-readable screen name this coachmark anchors on. */
  screen: string;
}

/**
 * The home screen's feature map. The `anchorId`s here must match the ids passed
 * to `useCoachmarkAnchor(...)` on `home-screen.tsx`. Keep the copy short — a
 * coachmark is a nudge, not a paragraph.
 */
export const HOME_COACHMARKS: CoachmarkFeature[] = [
  {
    id: "home_view_todos",
    screen: "Home",
    anchorId: "home_view_todos",
    message: "Jump straight into your todos from here.",
    gesture: "tap",
  },
  {
    id: "home_settings",
    screen: "Home",
    anchorId: "home_settings",
    message: "Make the app yours — theme, profile, and more live in Settings.",
    gesture: "tap",
  },
];

/**
 * Build the ordered step list for the home tour.
 *
 * Pass nothing for the current behavior (full catalog, declared order). When the
 * AI-selection phase lands, forward the backend's chosen id list:
 *   buildHomeTourSteps(plan.coachmarks)
 */
export const buildHomeTourSteps = (selection?: string[]): CoachmarkFeature[] =>
  selectTourSteps(HOME_COACHMARKS, selection);

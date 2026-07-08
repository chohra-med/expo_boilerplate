/**
 * events.app.ts — the ONLY app-specific file in the analytics module.
 *
 * Holds this app's enum VALUES for the three params that carry app specificity
 * (feature_name / content_type / step_id). Keeping them here lets `events.ts`
 * stay byte-identical across every app that uses this module — the next app
 * swaps this file and nothing else.
 *
 * TEMPLATE: the values below are the generic set every boilerplate ships with.
 * Extend them as you build your own features — add a feature to FEATURE_NAMES,
 * a content kind to CONTENT_TYPES, or an onboarding step to STEP_IDS, then use
 * the typed value at your call site. Do NOT add new EVENT names here — those
 * live in the frozen `events.ts`; carry specificity in these params instead.
 */

/** The app's primary features (the `feature_name` param on FEATURE_* events). */
export const FEATURE_NAMES = {
  ONBOARDING: "onboarding",
  AUTH: "auth",
  HOME: "home",
  PAYWALL: "paywall",
  SETTINGS: "settings",
  NOTIFICATIONS: "notifications",
  // Analytics: extend EVENTS + call-sites for your features — add your own
  // feature names here (e.g. TODOS: "todos") and track FEATURE_* events with them.
  SAMPLE_FEATURE: "sample_feature",
} as const;
export type AppFeatureName = (typeof FEATURE_NAMES)[keyof typeof FEATURE_NAMES];

/** Kinds of content the app creates/consumes (the `content_type` param). */
export const CONTENT_TYPES = {
  PROFILE: "profile",
  // Add your content kinds here (e.g. TODO: "todo", NOTE: "note").
  SAMPLE_ITEM: "sample_item",
} as const;
export type AppContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

/**
 * Onboarding step identifiers (the `step_id` param on ONB_* events).
 * Covers the boilerplate's stock onboarding funnel screens. Add a value per
 * new onboarding step so step-level drop-off stays queryable per screen.
 */
export const STEP_IDS = {
  WELCOME: "welcome",
  QUESTIONNAIRE: "questionnaire",
  NOTIFICATIONS: "notifications",
  PRE_PAYWALL: "pre_paywall",
  PAYWALL: "paywall",
} as const;
export type AppStepId = (typeof STEP_IDS)[keyof typeof STEP_IDS];

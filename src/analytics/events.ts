/**
 * events.ts — the single source of truth for analytics event names.
 *
 * PORTABLE: this file is byte-identical across every app (Myelino, Morrow,
 * boilerplates). App-specific enum values (feature_name / content_type /
 * step_id) live ONLY in `events.app.ts`. Do NOT add app-specific event names
 * here — carry specificity in params instead.
 *
 * Rules for every value:
 *  - snake_case, <= 40 chars
 *  - must NOT start with the reserved prefixes firebase_ / google_ / ga_
 *  - reserved Firebase names we intentionally reuse (screen_view, first_open,
 *    session_start, purchase) are kept, never renamed.
 */

export const EVENTS = {
  // lifecycle
  APP_OPEN: "app_open",
  APP_FIRST_OPEN: "first_open",
  APP_FOREGROUND: "app_foreground",
  APP_BACKGROUND: "app_background",
  APP_UPDATED: "app_updated",
  // auth
  SIGN_UP: "sign_up",
  LOGIN: "login",
  LOGOUT: "logout",
  AUTH_METHOD_SELECTED: "auth_method_selected",
  AUTH_FAILED: "auth_failed",
  PASSWORD_RESET_REQUESTED: "password_reset_requested",
  // onboarding funnel (the drop-off core)
  ONB_START: "onboarding_start",
  ONB_STEP_SHOWN: "onboarding_step_shown",
  ONB_STEP_ANSWERED: "onboarding_step_answered",
  ONB_STEP_SKIPPED: "onboarding_step_skipped",
  ONB_STEP_BACK: "onboarding_step_back",
  ONB_DROPOFF: "onboarding_dropoff",
  ONB_ABANDONED: "onboarding_abandoned",
  ONB_COMPLETE: "onboarding_complete",
  ONB_PAYWALL_SHOWN: "onboarding_paywall_shown",
  // screen/session
  SCREEN_VIEW: "screen_view",
  SCREEN_EXIT: "screen_exit",
  // feature engagement (feature_name param carries specificity)
  FEATURE_OPENED: "feature_opened",
  FEATURE_USED: "feature_used",
  FEATURE_COMPLETED: "feature_completed",
  FEATURE_ABANDONED: "feature_abandoned",
  // content
  CONTENT_VIEW: "content_view",
  CONTENT_CREATE: "content_create",
  CONTENT_SAVE: "content_save",
  CONTENT_SHARE: "content_share",
  CONTENT_EDIT: "content_edit",
  CONTENT_DELETE: "content_delete",
  // search/filter
  SEARCH: "search",
  SEARCH_NO_RESULTS: "search_no_results",
  FILTER_APPLIED: "filter_applied",
  SORT_CHANGED: "sort_changed",
  // nav
  TAB_SWITCH: "tab_switch",
  NAV_BACK: "nav_back",
  DEEP_LINK_OPENED: "deep_link_opened",
  EXTERNAL_LINK_OPENED: "external_link_opened",
  // monetization
  PAYWALL_VIEW: "paywall_view",
  PAYWALL_DISMISSED: "paywall_dismissed",
  CHECKOUT_START: "checkout_start",
  PURCHASE: "purchase",
  PURCHASE_FAILED: "purchase_failed",
  PURCHASE_RESTORED: "purchase_restored",
  SUBSCRIPTION_CANCEL: "subscription_cancel",
  TRIAL_START: "trial_start",
  // errors/perf
  API_ERROR: "api_error",
  FALLBACK_TRIGGERED: "fallback_triggered",
  FORM_VALIDATION_ERROR: "form_validation_error",
  CRASH_BOUNDARY_HIT: "crash_boundary_hit",
  PERF_METRIC: "perf_metric",
  SCREEN_LOAD_TIME: "screen_load_time",
  API_LATENCY: "api_latency",
  // drop-off signals
  RAGE_TAP: "rage_tap",
  FORM_ABANDON: "form_abandon",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

// Dev-only guard: fail loudly if a bad event name slips into the registry.
if (__DEV__) {
  const RESERVED_PREFIXES = ["firebase_", "google_", "ga_"];
  const SNAKE_CASE = /^[a-z][a-z0-9_]*$/;
  for (const [key, value] of Object.entries(EVENTS)) {
    if (value.length > 40) {
      throw new Error(`[analytics] EVENTS.${key} = "${value}" exceeds 40 chars.`);
    }
    if (!SNAKE_CASE.test(value)) {
      throw new Error(`[analytics] EVENTS.${key} = "${value}" is not snake_case.`);
    }
    for (const prefix of RESERVED_PREFIXES) {
      if (value.startsWith(prefix)) {
        throw new Error(`[analytics] EVENTS.${key} = "${value}" uses reserved prefix "${prefix}".`);
      }
    }
  }
}

/**
 * Analytics module — portable Firebase Analytics seam.
 *
 * Public surface. Import from here everywhere:
 *   import { analytics, EVENTS, FEATURE_NAMES } from '@/src/analytics';
 */

export type { Analytics } from "./analytics";
export { analytics } from "./analytics";
export type { EventName } from "./events";
export { EVENTS } from "./events";
export type {
  AppContentType,
  AppFeatureName,
  AppStepId,
} from "./events.app";
export {
  CONTENT_TYPES,
  FEATURE_NAMES,
  STEP_IDS,
} from "./events.app";
export type {
  AnalyticsParams,
  AuthParams,
  ContentParams,
  ErrorParams,
  FeatureParams,
  OnboardingParams,
  PaywallParams,
  ScreenParams,
  SearchParams,
} from "./params";
export { sanitizeParams } from "./params";
export type { Funnel } from "./useFunnel";
export { useFunnel } from "./useFunnel";
export type { UserPropertyName } from "./userProperties";
export {
  isoWeek,
  setAbVariant,
  setAcquisitionCampaign,
  setAcquisitionSource,
  setNotificationsEnabled,
  setOnboardingCompleted,
  setPlanTier,
  setPreferredLang,
  setSignupWeek,
  USER_PROPERTIES,
} from "./userProperties";
export { useScreenTracking } from "./useScreenTracking";

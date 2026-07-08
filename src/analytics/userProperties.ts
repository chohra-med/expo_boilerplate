/**
 * userProperties.ts — the segmentation axis on every Firebase report.
 *
 * PORTABLE: names are identical across apps. Values must NEVER be PII and are
 * clamped to Firebase's 36-char limit by analytics.setUserProperty().
 */

import { analytics } from "./analytics";

export const USER_PROPERTIES = {
  ACQUISITION_SOURCE: "acquisition_source",
  ACQUISITION_CAMPAIGN: "acquisition_campaign",
  PLAN_TIER: "plan_tier",
  ONBOARDING_COMPLETED: "onboarding_completed",
  SIGNUP_WEEK: "signup_week",
  NOTIFICATIONS_ENABLED: "notifications_enabled",
  PREFERRED_LANG: "preferred_lang",
  AB_VARIANT: "ab_variant",
} as const;

export type UserPropertyName = (typeof USER_PROPERTIES)[keyof typeof USER_PROPERTIES];

/** Attribution channel (e.g. AppsFlyer media_source). */
export const setAcquisitionSource = (source: string): Promise<void> =>
  analytics.setUserProperty(USER_PROPERTIES.ACQUISITION_SOURCE, source);

/** Attribution campaign name. */
export const setAcquisitionCampaign = (campaign: string): Promise<void> =>
  analytics.setUserProperty(USER_PROPERTIES.ACQUISITION_CAMPAIGN, campaign);

/** Monetization tier, e.g. 'free' | 'premium'. */
export const setPlanTier = (tier: string): Promise<void> =>
  analytics.setUserProperty(USER_PROPERTIES.PLAN_TIER, tier);

/** Whether the user finished onboarding. */
export const setOnboardingCompleted = (completed: boolean): Promise<void> =>
  analytics.setUserProperty(USER_PROPERTIES.ONBOARDING_COMPLETED, completed ? "true" : "false");

/** ISO-week cohort the user signed up in, e.g. '2026-W27'. */
export const setSignupWeek = (week: string): Promise<void> =>
  analytics.setUserProperty(USER_PROPERTIES.SIGNUP_WEEK, week);

/** OS notification permission state. */
export const setNotificationsEnabled = (enabled: boolean): Promise<void> =>
  analytics.setUserProperty(USER_PROPERTIES.NOTIFICATIONS_ENABLED, enabled ? "true" : "false");

/** Active i18n language, e.g. 'en'. */
export const setPreferredLang = (lang: string): Promise<void> =>
  analytics.setUserProperty(USER_PROPERTIES.PREFERRED_LANG, lang);

/** A/B experiment variant. */
export const setAbVariant = (variant: string): Promise<void> =>
  analytics.setUserProperty(USER_PROPERTIES.AB_VARIANT, variant);

/**
 * Derive an ISO-week string ('YYYY-Www') for the signup_week cohort property.
 * Kept here so every app computes the cohort identically.
 */
export const isoWeek = (date: Date = new Date()): string => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

/**
 * params.ts — typed param groups + sanitizeParams().
 *
 * PORTABLE: identical across apps. The typed groups document the params each
 * event family carries; sanitizeParams() is the runtime guard that enforces
 * Firebase limits and strips PII before anything reaches the transport.
 *
 * Firebase limits enforced here:
 *  - <= 25 params per event
 *  - key <= 40 chars, string value <= 100 chars
 *  - booleans -> 0/1 (Firebase has no bool param type)
 *  - objects/arrays -> JSON string (then length-clamped)
 *  - NEVER include a `timestamp` param (Firebase stamps server-side).
 */

import type { AppContentType, AppFeatureName, AppStepId } from "./events.app";

// biome-ignore lint/suspicious/noExplicitAny: analytics params are heterogeneous by nature
export type ParamValue = any;
export type AnalyticsParams = Record<string, ParamValue>;

// ---- Typed param groups (documentation + call-site help) --------------------

export interface OnboardingParams {
  step_index?: number;
  step_id?: AppStepId;
  answer_type?: string;
  time_on_step_ms?: number;
  last_step_index?: number;
  total_steps?: number;
}

export interface FeatureParams {
  feature_name: AppFeatureName;
  duration_ms?: number;
}

export interface ContentParams {
  content_type: AppContentType;
  content_id?: string;
}

export interface PaywallParams {
  source?: string;
  package_id?: string;
  price?: number;
  currency?: string;
}

export interface ErrorParams {
  endpoint?: string;
  status?: number;
  error_type?: string;
}

export interface AuthParams {
  method?: string;
  reason?: string;
}

export interface ScreenParams {
  screen_name: string;
  previous_screen?: string;
  time_on_screen_ms?: number;
}

export interface SearchParams {
  query_length?: number;
  result_count?: number;
  filter_type?: string;
}

// ---- Sanitizer --------------------------------------------------------------

const MAX_PARAMS = 25;
const MAX_KEY_LEN = 40;
const MAX_STRING_LEN = 100;

/**
 * Keys/substrings that must never be logged as analytics params (PII denylist).
 * Matching is case-insensitive and substring-based on the param key.
 */
const PII_DENYLIST = [
  "email",
  "password",
  "phone",
  "first_name",
  "last_name",
  "full_name",
  "username",
  "address",
  "token",
  "lat",
  "lng",
  "latitude",
  "longitude",
  "dob",
  "birth",
  "ssn",
  "card",
  "secret",
  "authorization",
];

const isPiiKey = (key: string): boolean => {
  const lower = key.toLowerCase();
  return PII_DENYLIST.some((needle) => lower.includes(needle));
};

const clampString = (value: string): string =>
  value.length > MAX_STRING_LEN ? value.slice(0, MAX_STRING_LEN) : value;

/**
 * Enforce Firebase param rules and strip PII. Never throws — bad input is
 * dropped/coerced so analytics can never break the app.
 */
export const sanitizeParams = (params?: AnalyticsParams): AnalyticsParams | undefined => {
  if (!params) {
    return undefined;
  }

  const out: AnalyticsParams = {};
  let count = 0;

  for (const rawKey of Object.keys(params)) {
    if (count >= MAX_PARAMS) {
      break;
    }

    const value = params[rawKey];
    if (value === undefined || value === null) {
      continue;
    }

    // Never allow a client-supplied timestamp (Firebase stamps server-side).
    if (rawKey === "timestamp") {
      continue;
    }

    const key = rawKey.slice(0, MAX_KEY_LEN);
    if (isPiiKey(key)) {
      continue;
    }

    if (typeof value === "boolean") {
      out[key] = value ? 1 : 0;
    } else if (typeof value === "number") {
      out[key] = Number.isFinite(value) ? value : 0;
    } else if (typeof value === "string") {
      out[key] = clampString(value);
    } else if (typeof value === "object") {
      try {
        out[key] = clampString(JSON.stringify(value));
      } catch {
        continue;
      }
    } else {
      out[key] = clampString(String(value));
    }

    count += 1;
  }

  return out;
};

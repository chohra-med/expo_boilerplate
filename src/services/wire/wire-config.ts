/**
 * wire-config — the ONE place this app reads the `EXPO_PUBLIC_WIREAI_*` environment.
 *
 * @description Resolves the Wire AI transport ONCE per process and hands every Wire surface
 * (onboarding, lifecycle events, feature flags, review gate, questionnaire gate, purchase
 * funnel, dev QA trigger) the same answer. With NO Wire env vars set, every getter here
 * returns `null` / `undefined` and the whole integration is inert.
 *
 * ## Why the memo is load-bearing, not a micro-optimisation
 * The kit's `wireConfigFromEnv()` emits a dev-only `console.warn` NAMING the missing var on
 * EVERY call (`config/wireConfigFromEnv.ts`, no once-latch). That warning is correct and
 * deliberate — a silently disabled kit is the kit's quietest failure — but it is a per-call
 * warning, and `isOnboardingEnabled()` calls `wireConfigFromEnv()` a second time internally.
 * Before this module, three call sites each ran that pair on every render, so a fresh clone
 * with no keys paid a growing pile of identical warnings. Reading the env once, here, bounds
 * it to a single notice per process no matter how many Wire surfaces mount.
 *
 * ⚠️ Do NOT "simplify" this by re-reading the env per call, and do NOT read
 * `process.env.EXPO_PUBLIC_*` through an alias or computed access — Expo's `inline-env-vars`
 * babel plugin only inlines STATIC `process.env.EXPO_PUBLIC_FOO` member expressions, so an
 * aliased read works in Jest (real Node env) and is `undefined` on a real device.
 *
 * ## App-agnostic on purpose
 * This file is part of the SHARED layer that `launcher-sync` pushes from Standard into the
 * other launcher tiers, so it imports `@wireai/activation` and nothing else. No MMKV, no
 * expo-constants, no expo-notifications, no react-native-purchases: the Lite (public) tier
 * ships none of those. Anything native is injected by the per-app mount.
 *
 * @example
 * ```typescript
 * import { getWireConfig, isWireEnabled } from '#root/services/wire';
 *
 * if (!isWireEnabled()) return <StaticOnboarding />;
 * return <WireOnboarding config={getWireConfig()!} />;
 * ```
 */
import {
  type WireFeaturesConfig,
  type WireOnboardingConfig,
  type WireOnboardingStorage,
  wireConfigFromEnv,
} from "@wireai/activation";

/**
 * Where kit → server requests go for the gates (review / questionnaire). Structurally identical
 * to the kit's `ReviewTarget` and `QuestionnaireTarget`, declared here so the shared layer does
 * not have to import a subpath just for a two-field type.
 */
export interface WireTarget {
  serverUrl: string;
  apiKey: string;
}

/**
 * The app id every Wire surface namespaces on. Read via STATIC member access so Metro inlines
 * it (see the module note above).
 */
export const WIRE_APP_ID = process.env.EXPO_PUBLIC_WIREAI_APP_ID ?? "default";

/**
 * The memo. `undefined` = not read yet; `null` = read, and Wire is OFF.
 * A module-scope latch, so the env is read (and the kit's missing-key notice printed) once.
 */
let cachedConfig: WireOnboardingConfig | null | undefined;

/**
 * The resolved Wire AI transport, or `null` when the env is unset.
 *
 * @returns The kit config when `EXPO_PUBLIC_WIREAI_API_KEY` + `EXPO_PUBLIC_WIREAI_SERVER_URL`
 * are both set, otherwise `null`.
 */
export const getWireConfig = (): WireOnboardingConfig | null => {
  if (cachedConfig === undefined) {
    cachedConfig = wireConfigFromEnv({ appId: WIRE_APP_ID });
  }
  return cachedConfig;
};

/**
 * Whether any Wire surface may do anything at all.
 *
 * Equivalent to the kit's `isOnboardingEnabled()` (the gate is transport presence) but reads
 * the memo instead of re-parsing the env, so it costs nothing and prints nothing.
 *
 * @returns `true` only when a Wire transport is configured.
 */
export const isWireEnabled = (): boolean => getWireConfig() !== null;

/**
 * The server target for the review + questionnaire gates.
 *
 * @returns `undefined` when Wire is off — which is exactly what both gates want: with no
 * target they never reach the network and fall back to their local, fail-closed rules.
 */
export const getWireTarget = (): WireTarget | undefined => {
  const config = getWireConfig();
  return config ? { serverUrl: config.serverUrl, apiKey: config.apiKey } : undefined;
};

/**
 * The feature-flag (kill switch) config for `WireFeaturesProvider`.
 *
 * @param storage Optional host storage for the last-known-flags cache, so a cold start with a
 * dead control plane still uses the last flags this device saw instead of the defaults.
 * @returns `undefined` when Wire is off, which keeps the provider from ever fetching.
 */
export const getWireFeaturesConfig = (
  storage?: WireOnboardingStorage
): WireFeaturesConfig | undefined => {
  const config = getWireConfig();
  return config
    ? {
        serverUrl: config.serverUrl,
        apiKey: config.apiKey,
        appId: config.appId,
        storage,
      }
    : undefined;
};

/**
 * Test-only: forget the memo so a suite can re-read a mutated `process.env`.
 *
 * @description Never call this from app code. It exists because the memo is a module-scope
 * latch and a test that changes the env after first read would otherwise be reading a value
 * frozen by an earlier test.
 */
export const resetWireConfigCache = (): void => {
  cachedConfig = undefined;
};

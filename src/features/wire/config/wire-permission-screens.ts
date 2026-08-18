import type { PermissionScreenConfig } from "@wireai/activation";
import { buildWirePermissionScreens, isWireEnabled } from "#root/services/wire";

/**
 * This app's mid-flow permission priming screens for the Wire onboarding flow.
 *
 * @description The shared builder (`#root/services/wire`) owns the shape and the env gate; this
 * file owns the ONE thing that cannot be shared — the native permission module. The kit imports
 * NONE: it takes `request` / `getStatus` / `openSettings` from the host so the shared layer stays
 * importable in every launcher tier.
 *
 * ── WHY THIS PUBLIC (Lite) TIER SHIPS NO HANDLERS ────────────────────────────
 * Lite is the template a stranger clones and runs under Expo Go, so it deliberately bundles NO
 * permissions module (`expo-notifications` is not a dependency here). With no handler injected,
 * `buildWirePermissionScreens` returns an EMPTY array — the kit's "no permission screens" — and
 * the onboarding flow is byte-identical to what it has always been. Nothing to prime, nothing to
 * break.
 *
 * ── HOW TO TURN IT ON IN YOUR APP ────────────────────────────────────────────
 * Install a permissions module and inject its handlers below. `request` is the ONLY function the
 * kit calls that can open an OS dialog, and it calls it from the user's primary tap alone — never
 * on mount. iOS grants exactly ONE native notification prompt per install; a priming screen makes
 * sure it is spent on someone who has been told why.
 *
 * @example
 * ```typescript
 * import * as Notifications from "expo-notifications";
 * import { Linking } from "react-native";
 *
 * const toStatus = (status: string, canAskAgain: boolean): WirePermissionStatus =>
 *   status === "granted" ? "granted" : canAskAgain ? "denied" : "blocked";
 *
 * return buildWirePermissionScreens(
 *   {
 *     notifications: {
 *       placement: "beforeEnd",
 *       request: async () => {
 *         const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
 *         return toStatus(status, canAskAgain);
 *       },
 *       getStatus: async () => {
 *         const { status, canAskAgain } = await Notifications.getPermissionsAsync();
 *         return toStatus(status, canAskAgain);
 *       },
 *       openSettings: () => void Linking.openSettings(),
 *     },
 *   },
 *   isWireEnabled()
 * );
 * ```
 *
 * @returns The configured screens, or an EMPTY array when no handler is injected (the Lite
 * default) or no Wire transport is configured — in which case the onboarding flow is unchanged.
 */
export const getWirePermissionScreens = (): PermissionScreenConfig[] =>
  buildWirePermissionScreens({}, isWireEnabled());

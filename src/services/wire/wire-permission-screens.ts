/**
 * wire-permission-screens — build the kit's mid-flow permission priming screens, env-gated.
 *
 * @description iOS grants an app exactly ONE native notification prompt for its entire
 * lifetime. Firing it on mount — the shape most apps ship — spends that single ask on a user
 * who has not been told why. The kit's `permissionScreens` prop puts a cheap in-app rationale
 * screen in front of it and only forwards the users who said yes; the OS dialog is reached from
 * the primary tap and from nowhere else.
 *
 * ## What this file adds over calling the kit directly
 * The kit is dependency-free here by design: it imports NO native permission module and instead
 * takes `request` / `getStatus` / `openSettings` from the host. This builder keeps that seam
 * intact for the SHARED layer — it imports no `expo-notifications`, because the public Lite tier
 * does not ship it — and adds the two things every tier wants identically:
 *   1. the env gate (no Wire transport → NO permission screens at all, so a fresh clone's
 *      onboarding is byte-identical to what it has always been), and
 *   2. one place to keep the placement + id conventions consistent across tiers.
 *
 * @example
 * ```typescript
 * // Per-app mount injects the native module:
 * import * as Notifications from 'expo-notifications';
 *
 * const screens = buildWirePermissionScreens({
 *   notifications: {
 *     request: async () => {
 *       const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
 *       return status === 'granted' ? 'granted' : canAskAgain ? 'denied' : 'blocked';
 *     },
 *   },
 * });
 * <WireOnboarding permissionScreens={screens} />
 * ```
 */
import type {
  PermissionPlacement,
  PermissionScreenConfig,
  WirePermissionKind,
  WirePermissionOutcome,
  WirePermissionStatus,
} from "@wireai/activation";

/** The native handlers ONE permission screen needs. All host-supplied; the kit imports none. */
export interface WirePermissionHandlers {
  /** THE ONLY function that may open an OS dialog. The kit calls it from the primary tap only. */
  request: () => Promise<WirePermissionStatus>;
  /** Optional NON-PROMPTING status read, so a `blocked` user is offered Settings instead of an
   *  "Enable" button that would open nothing. */
  getStatus?: () => Promise<WirePermissionStatus>;
  /** Open the OS settings page. Only reachable on the `blocked` route. */
  openSettings?: () => void | Promise<void>;
  /** Where the screen sits in the (server-decided, variable-length) stream. Default `beforeEnd`. */
  placement?: PermissionPlacement;
  /** Fired once with the outcome. The seam for scheduling a local notification on a grant — the
   *  kit deliberately schedules nothing itself. A throw here is caught and the flow continues. */
  onResult?: (permission: WirePermissionKind, outcome: WirePermissionOutcome) => void;
}

export interface BuildWirePermissionScreensOptions {
  /** Notification priming. Omit to ship no notification screen. */
  notifications?: WirePermissionHandlers;
  /** Any other permission the app wants to prime, keyed by the kit's `permission` string. */
  extra?: Array<WirePermissionHandlers & { permission: WirePermissionKind }>;
  /**
   * Escape hatch for tests: build the screens even with no Wire transport configured. App code
   * must never pass this — the env gate is the whole point.
   */
  force?: boolean;
}

/**
 * Build the `permissionScreens` array for `<WireOnboarding>`.
 *
 * @param options The per-app native handlers.
 * @param enabled Whether Wire is configured. Injected rather than read here so this function
 * stays pure and the caller keeps a single env read.
 * @returns A `PermissionScreenConfig[]`, or an EMPTY array when Wire is off or nothing was
 * supplied. An empty array is the kit's "no permission screens" — the flow is unchanged and
 * completion never blocks on a grant either way.
 */
export const buildWirePermissionScreens = (
  options: BuildWirePermissionScreensOptions,
  enabled: boolean
): PermissionScreenConfig[] => {
  if (!enabled && !options.force) {
    return [];
  }

  const screens: PermissionScreenConfig[] = [];

  if (options.notifications) {
    screens.push(toScreen("notifications", options.notifications));
  }

  for (const entry of options.extra ?? []) {
    screens.push(toScreen(entry.permission, entry));
  }

  return screens;
};

/**
 * Map one set of host handlers onto the kit's screen config.
 *
 * @description `id` is set explicitly rather than left to the kit's positional default
 * (`<permission>:<index>`), because that default silently re-keys the once-only record the day
 * someone reorders the array — and a re-keyed record means a user is primed a second time.
 */
const toScreen = (
  permission: WirePermissionKind,
  handlers: WirePermissionHandlers
): PermissionScreenConfig => ({
  permission,
  id: `wire-${permission}`,
  placement: handlers.placement ?? "beforeEnd",
  request: handlers.request,
  getStatus: handlers.getStatus,
  openSettings: handlers.openSettings,
  onResult: handlers.onResult,
});

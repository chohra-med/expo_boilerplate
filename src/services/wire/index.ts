/**
 * Wire AI shared integration layer.
 *
 * @description Everything in this folder is APP-AGNOSTIC: it imports `@wireai/activation` and
 * nothing else. No MMKV, no expo-constants, no expo-notifications, no react-native-purchases —
 * the public Lite tier ships none of those, and this layer is propagated to every tier by
 * `launcher-sync`. Anything native is INJECTED by the per-app mount.
 *
 * See `./README.md` for the capability map and the mount checklist.
 */
export type { WireTarget } from "./wire-config";
export {
  getWireConfig,
  getWireFeaturesConfig,
  getWireTarget,
  isWireEnabled,
  resetWireConfigCache,
  WIRE_APP_ID,
} from "./wire-config";
export type { WireGateStorage, WireGateStorageBackend } from "./wire-gate-storage";
export { createInMemoryGateStorage, createWireGateStorage } from "./wire-gate-storage";
export type {
  BuildWirePermissionScreensOptions,
  WirePermissionHandlers,
} from "./wire-permission-screens";
export { buildWirePermissionScreens } from "./wire-permission-screens";
export type { WirePurchaseFunnel, WirePurchaseFunnelOptions } from "./wire-purchase-funnel";
export { createWirePurchaseFunnel } from "./wire-purchase-funnel";

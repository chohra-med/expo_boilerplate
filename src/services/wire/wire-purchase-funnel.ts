/**
 * wire-purchase-funnel — the purchase half of the activation funnel, env-gated and inert.
 *
 * @description Wraps the kit's `createRevenueCatBridge` so a paywall can report the five
 * purchase moments (shown → checkout → completed / failed / restored) into the SAME Wire event
 * stream as onboarding, joined on `user_context.device_key`. With no Wire env vars set, this
 * hands back a no-op funnel: no analytics instance is constructed, no network is touched, and
 * every method is an empty function.
 *
 * ## Two things this deliberately does NOT do
 *
 * 1. **It never imports `react-native-purchases`.** The kit types RevenueCat STRUCTURALLY on
 *    purpose, so the bridge is adopted with zero new dependencies. That matters most for the
 *    public Lite tier, which ships no purchase SDK at all — this file still compiles and runs
 *    there, it just never has anything to report.
 *
 * 2. **It reports; it never decides.** Every method returns `void`. The kit's own
 *    `RevenueCatBridge.purchaseCompleted()` returns "is the user entitled now", which is
 *    tempting to branch on — and would be a live bug the day Wire is switched off, because a
 *    no-op funnel would answer `false` and a paywall branching on it would refuse to unlock a
 *    purchase that actually succeeded. Narrowing the surface to void makes that mistake
 *    unrepresentable. Entitlement stays where it already is: the caller's own check against
 *    RevenueCat's `customerInfo`.
 *
 * @example
 * ```typescript
 * const funnel = createWirePurchaseFunnel({ entitlementId: 'pro', storage });
 * funnel.paywallShown(offering, { variant });
 * funnel.checkoutStarted(pkg, { variant });
 * funnel.purchaseCompleted(customerInfo, pkg, { variant });
 * ```
 */
import type {
  PurchaseProps,
  RevenueCatCustomerInfoLike,
  RevenueCatOfferingLike,
  RevenueCatPackageLike,
  WireOnboardingStorage,
} from "@wireai/activation";
import { createRevenueCatBridge } from "@wireai/activation";
import { createAnalytics } from "@wireai/activation/analytics";
import { getWireConfig } from "./wire-config";

/** The report-only purchase surface. Every method is fire-and-forget and never throws. */
export interface WirePurchaseFunnel {
  /** `true` when a Wire transport is configured and events actually leave the device. */
  readonly isActive: boolean;
  /** The paywall became visible. Fires even with no offering — a paywall with nothing to sell
   *  is exactly the failure worth seeing in the funnel. */
  paywallShown: (offering?: RevenueCatOfferingLike, props?: PurchaseProps) => void;
  /** The user tapped buy and the store sheet is opening. */
  checkoutStarted: (pkg: RevenueCatPackageLike, props?: PurchaseProps) => void;
  /** The store returned from a purchase. Reports completed vs `not_entitled` and syncs plan tier. */
  purchaseCompleted: (
    customerInfo: RevenueCatCustomerInfoLike | undefined,
    pkg?: RevenueCatPackageLike,
    props?: PurchaseProps
  ) => void;
  /** The purchase call rejected. The kit separates a user cancel from a real store error. */
  purchaseFailed: (error: unknown, pkg?: RevenueCatPackageLike, props?: PurchaseProps) => void;
  /** A restore finished. Reports the resulting tier. */
  purchasesRestored: (
    customerInfo: RevenueCatCustomerInfoLike | undefined,
    props?: PurchaseProps
  ) => void;
  /** Write the current plan tier to the user context WITHOUT emitting an event. Call once at
   *  launch with a `getCustomerInfo()` snapshot so returning subscribers segment correctly. */
  syncPlanTier: (customerInfo: RevenueCatCustomerInfoLike | undefined) => void;
}

export interface WirePurchaseFunnelOptions {
  /** The entitlement identifier that means "paid" in THIS app, exactly as configured in the
   *  RevenueCat dashboard. Per-app: the shared layer must not guess it. */
  entitlementId: string;
  /** Host persistence for the event queue + the auto-minted device key. Without it the queue is
   *  in-memory only (survives re-renders, not app kills) and the join key is per-launch. */
  storage?: WireOnboardingStorage;
  /** Non-PII props merged into EVERY event from this funnel. */
  commonProps?: PurchaseProps;
}

/** The inert funnel. Structurally complete, does nothing, allocates nothing. */
const NOOP_FUNNEL: WirePurchaseFunnel = {
  isActive: false,
  paywallShown: () => undefined,
  checkoutStarted: () => undefined,
  purchaseCompleted: () => undefined,
  purchaseFailed: () => undefined,
  purchasesRestored: () => undefined,
  syncPlanTier: () => undefined,
};

/**
 * Build the purchase funnel for this app.
 *
 * @param options The app's entitlement id, host storage, and any common props.
 * @returns A live funnel when Wire is configured, otherwise the shared no-op funnel. Safe to
 * call at module scope: with no env it constructs nothing at all.
 */
export const createWirePurchaseFunnel = (
  options: WirePurchaseFunnelOptions
): WirePurchaseFunnel => {
  const config = getWireConfig();
  if (!config) {
    return NOOP_FUNNEL;
  }

  // One analytics instance for the purchase funnel. It auto-mints and persists the
  // `device_key` that joins these events to the same install's onboarding session.
  const analytics = createAnalytics({
    serverUrl: config.serverUrl,
    apiKey: config.apiKey,
    appId: config.appId,
    appVersion: config.appVersion,
    storage: options.storage,
  });

  const bridge = createRevenueCatBridge({
    analytics,
    entitlementId: options.entitlementId,
    commonProps: options.commonProps,
  });

  return {
    isActive: true,
    paywallShown: (offering, props) => bridge.paywallShown(offering, props),
    checkoutStarted: (pkg, props) => bridge.checkoutStarted(pkg, props),
    // Return values deliberately dropped — see the module note. The caller owns entitlement.
    purchaseCompleted: (customerInfo, pkg, props) => {
      bridge.purchaseCompleted(customerInfo, pkg, props);
    },
    purchaseFailed: (error, pkg, props) => bridge.purchaseFailed(error, pkg, props),
    purchasesRestored: (customerInfo, props) => {
      bridge.purchasesRestored(customerInfo, props);
    },
    syncPlanTier: (customerInfo) => {
      bridge.syncPlanTier(customerInfo);
    },
  };
};

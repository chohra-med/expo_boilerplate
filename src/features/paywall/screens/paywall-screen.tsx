import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Purchases, { type PurchasesPackage } from "react-native-purchases";
import { analytics, EVENTS, FEATURE_NAMES, setPlanTier } from "#root/analytics";
import { completeOnboarding } from "#root/features/onboarding/store/onboarding-slice";
import { wireOnboardingStorage } from "#root/features/onboarding/services/wire-onboarding-storage";
import { logger } from "#root/services/logging";
import { ENTITLEMENT_ID, revenueCatService } from "#root/services/revenuecat";
import { createWirePurchaseFunnel } from "#root/services/wire";
import { useAppDispatch } from "#root/store/store";
import { PaywallView } from "../components/paywall-view";
import { getPaywallConfigForVariant } from "../config/paywall-config";
import { paywallStorageService } from "../services/paywall-storage.service";
import type { PaywallPackage } from "../types";

/**
 * Paywall Screen Component (Container)
 *
 * @description Connects PaywallView to Redux + RevenueCat. Presentational logic
 * lives in PaywallView (usable standalone/in Storybook).
 *
 * Lite boilerplate notes:
 *  - The paid entitlement is parameterized via `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID`
 *    (default `premium`) — see `ENTITLEMENT_ID`.
 *  - Remote Config (A/B paywall variants) is a Standard-tier feature; here the
 *    variant is fixed to "control". Swap `getPaywallConfigForVariant` inputs to
 *    add your own variants.
 *  - When shown as the last onboarding step, pass `onboarding` so completing a
 *    purchase / skip finishes onboarding. Otherwise it just navigates back.
 */
export type PaywallScreenProps = {
  /** Render as the terminal onboarding step (completes onboarding on skip/purchase). */
  onboarding?: boolean;
};

const _PaywallScreen: React.FC<PaywallScreenProps> = ({ onboarding = false }) => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  // Wire AI purchase funnel — reports the five purchase moments (shown → checkout →
  // completed / failed / restored) into the SAME event stream as onboarding, joined on the
  // install's `device_key` via the shared onboarding storage. Report-only: it never decides
  // entitlement (that stays the RevenueCat check below). With no Wire key it is a structural
  // no-op that constructs nothing and touches no network.
  const wirePurchases = useMemo(
    () =>
      createWirePurchaseFunnel({
        entitlementId: ENTITLEMENT_ID,
        storage: wireOnboardingStorage,
      }),
    []
  );

  // No Remote Config in the Lite tier — the default "control" variant is used.
  const paywallVariant = "control";

  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState<PaywallPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PaywallPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentLanguage = useMemo(() => {
    const lang = i18n.language || "en";
    return lang.startsWith("fr") ? "fr" : "en";
  }, [i18n.language]);

  const paywallConfig = useMemo(
    () => getPaywallConfigForVariant(paywallVariant, currentLanguage),
    [currentLanguage]
  );

  const finishOrGoBack = useCallback(() => {
    if (onboarding) {
      dispatch(completeOnboarding());
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [onboarding, dispatch, navigation]);

  const handleSkip = useCallback(() => {
    paywallStorageService.saveSkipTimestamp();
    analytics.track(EVENTS.PAYWALL_DISMISSED, { source: paywallVariant });
    finishOrGoBack();
  }, [finishOrGoBack]);

  const loadOfferings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const offering = await revenueCatService.getOfferings();

      if (!offering?.availablePackages || offering.availablePackages.length === 0) {
        setError("No subscription packages available");
        logger.warn("[Paywall] No offerings available");
        return;
      }

      const convertedPackages: PaywallPackage[] = offering.availablePackages.map(
        (pkg: PurchasesPackage) => ({
          identifier: pkg.identifier,
          packageType: pkg.packageType,
          product: {
            identifier: pkg.product.identifier,
            description: pkg.product.description,
            title: pkg.product.title,
            price: pkg.product.price.toString(),
            priceString: pkg.product.priceString,
            currencyCode: pkg.product.currencyCode,
            introPrice: pkg.product.introPrice
              ? {
                  price: pkg.product.introPrice.price.toString(),
                  priceString: pkg.product.introPrice.priceString,
                  period: pkg.product.introPrice.period,
                  cycles: pkg.product.introPrice.cycles,
                }
              : undefined,
          },
        })
      );

      setPackages(convertedPackages);

      if (convertedPackages.length > 0) {
        setSelectedPackage(convertedPackages[0]);
      }

      // Wire funnel: the paywall became visible with a real offering.
      wirePurchases.paywallShown(offering);

      analytics.track(EVENTS.PAYWALL_VIEW, {
        source: paywallVariant,
        packages_count: convertedPackages.length,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load subscriptions";
      setError(errorMessage);
      logger.error("[Paywall] Failed to load offerings", err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectPackage = useCallback((pkg: PaywallPackage) => {
    setSelectedPackage(pkg);
    analytics.track(EVENTS.FEATURE_USED, {
      feature_name: FEATURE_NAMES.PAYWALL,
      package_id: pkg.identifier,
      source: paywallVariant,
    });
  }, []);

  const handlePurchase = useCallback(async () => {
    if (!selectedPackage) return;

    try {
      setIsPurchasing(true);
      setError(null);

      analytics.track(EVENTS.CHECKOUT_START, {
        package_id: selectedPackage.identifier,
        price: Number(selectedPackage.product.price),
        currency: selectedPackage.product.currencyCode,
        source: paywallVariant,
      });

      const offering = await revenueCatService.getOfferings();
      if (!offering) {
        throw new Error("No offerings available");
      }

      const revenueCatPackage = offering.availablePackages.find(
        (pkg: PurchasesPackage) => pkg.identifier === selectedPackage.identifier
      );

      if (!revenueCatPackage) {
        throw new Error("Package not found");
      }

      // Wire funnel: the user tapped buy and the store sheet is opening.
      wirePurchases.checkoutStarted(revenueCatPackage);

      const purchaseResult = await Purchases.purchasePackage(revenueCatPackage);

      // Wire funnel: the store returned. Reports completed vs not_entitled and syncs plan tier —
      // it does NOT decide entitlement; the check below owns that.
      wirePurchases.purchaseCompleted(purchaseResult.customerInfo, revenueCatPackage);

      if (typeof purchaseResult.customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {
        analytics.track(EVENTS.PURCHASE, {
          package_id: selectedPackage.identifier,
          price: Number(selectedPackage.product.price),
          currency: selectedPackage.product.currencyCode,
          source: paywallVariant,
        });
        // Reflect the new entitlement on the user's segmentation axis so paid vs
        // free splits are queryable immediately.
        void setPlanTier(ENTITLEMENT_ID);
        finishOrGoBack();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Purchase failed";
      setError(errorMessage);
      logger.error("[Paywall] Purchase failed", err as Error);

      // Wire funnel: the purchase rejected. The kit separates a user cancel from a store error.
      wirePurchases.purchaseFailed(err);

      analytics.track(EVENTS.PURCHASE_FAILED, {
        package_id: selectedPackage.identifier,
        source: paywallVariant,
        error_type: errorMessage,
      });
    } finally {
      setIsPurchasing(false);
    }
  }, [selectedPackage, finishOrGoBack]);

  const handleRestore = useCallback(async () => {
    try {
      setIsLoading(true);
      const restoredInfo = await revenueCatService.restorePurchases();

      // Wire funnel: a restore finished. Reports the resulting tier.
      wirePurchases.purchasesRestored(restoredInfo ?? undefined);

      analytics.track(EVENTS.PURCHASE_RESTORED, { source: paywallVariant });

      const hasActive = await revenueCatService.hasActiveSubscription();
      // Keep plan_tier in sync with whatever the restore surfaced.
      void setPlanTier(hasActive ? ENTITLEMENT_ID : "free");
      if (hasActive) {
        finishOrGoBack();
      }
    } catch (err) {
      logger.error("[Paywall] Restore failed", err as Error);
      setError("Failed to restore purchases");
    } finally {
      setIsLoading(false);
    }
  }, [finishOrGoBack]);

  useEffect(() => {
    loadOfferings();
  }, [loadOfferings]);

  return (
    <PaywallView
      config={paywallConfig}
      packages={packages}
      selectedPackage={selectedPackage}
      isLoading={isLoading}
      isPurchasing={isPurchasing}
      error={error}
      onSelectPackage={handleSelectPackage}
      onPurchase={handlePurchase}
      onRestore={handleRestore}
      onSkip={handleSkip}
    />
  );
};

export const PaywallScreen = React.memo(_PaywallScreen);

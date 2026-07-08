import { Platform } from "react-native";
import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from "react-native-purchases";
import { logger } from "../logging/logger";

/**
 * RevenueCat Service
 * Manages in-app purchases and subscriptions
 */

export interface RevenueCatConfig {
  apiKey: string;
  appUserId?: string;
}

/**
 * The RevenueCat entitlement id that gates "premium". Parameterized so a buyer
 * points it at their own entitlement without touching code. Set
 * `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID` in `.env` (defaults to `premium`).
 */
export const ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID || "premium";

let isInitialized = false;

/**
 * Initialize RevenueCat
 */
export const initializeRevenueCat = async (config?: RevenueCatConfig): Promise<boolean> => {
  try {
    if (isInitialized) {
      logger.log("[RevenueCat] Already initialized");
      return true;
    }

    // Get API key from config or environment
    const apiKey =
      config?.apiKey ||
      (Platform.OS === "ios"
        ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
        : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY);

    if (!apiKey) {
      logger.warn("[RevenueCat] API key not found. RevenueCat will not be available.");
      return false;
    }

    // A RevenueCat "Test Store" key (test_...) in a release build makes the native SDK
    // deliberately crash the app on the next lifecycle pause (TestStoreErrorDialogActivity
    // -> RuntimeException) — a JS try/catch cannot stop it. Never hand a test key to
    // Purchases.configure() outside dev: skip init and let the paywall degrade gracefully
    // instead of taking the whole app down. Set a production Play Store (goog_) / App Store
    // (appl_) key in EXPO_PUBLIC_REVENUECAT_*_API_KEY before releasing.
    if (apiKey.startsWith("test_") && !__DEV__) {
      logger.warn(
        "[RevenueCat] Test Store API key detected in a release build — skipping init to avoid a native crash. " +
          "Set a production goog_/appl_ key in EXPO_PUBLIC_REVENUECAT_*_API_KEY (EAS production env) before release."
      );
      return false;
    }

    // Configure RevenueCat
    await Purchases.configure({ apiKey });

    // Set app user ID if provided
    if (config?.appUserId) {
      await Purchases.logIn(config.appUserId);
    }

    // Enable debug logs in development
    if (__DEV__) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

    isInitialized = true;
    logger.log("[RevenueCat] Initialized successfully");
    return true;
  } catch (error) {
    logger.error("[RevenueCat] Failed to initialize", error as Error);
    return false;
  }
};

/**
 * Get current customer info
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    if (!isInitialized) {
      logger.warn("[RevenueCat] Not initialized");
      return null;
    }
    return await Purchases.getCustomerInfo();
  } catch (error) {
    logger.error("[RevenueCat] Failed to get customer info", error as Error);
    return null;
  }
};

/**
 * Get available offerings
 */
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    if (!isInitialized) {
      logger.warn("[RevenueCat] Not initialized");
      return null;
    }
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    logger.error("[RevenueCat] Failed to get offerings", error as Error);
    return null;
  }
};

/**
 * Purchase a package
 */
export const purchasePackage = async (
  packageToPurchase: PurchasesPackage
): Promise<CustomerInfo | null> => {
  try {
    if (!isInitialized) {
      throw new Error("RevenueCat not initialized");
    }
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    logger.log("[RevenueCat] Purchase successful");
    return customerInfo;
  } catch (error) {
    logger.error("[RevenueCat] Purchase failed", error as Error);
    throw error;
  }
};

/**
 * Restore purchases
 */
export const restorePurchases = async (): Promise<CustomerInfo | null> => {
  try {
    if (!isInitialized) {
      throw new Error("RevenueCat not initialized");
    }
    const customerInfo = await Purchases.restorePurchases();
    logger.log("[RevenueCat] Purchases restored");
    return customerInfo;
  } catch (error) {
    logger.error("[RevenueCat] Failed to restore purchases", error as Error);
    throw error;
  }
};

/**
 * Check if user has active subscription
 */
export const hasActiveSubscription = async (): Promise<boolean> => {
  try {
    const customerInfo = await getCustomerInfo();
    if (!customerInfo) return false;
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    logger.error("[RevenueCat] Failed to check subscription status", error as Error);
    return false;
  }
};

/**
 * Set user ID
 */
export const setUserId = async (userId: string): Promise<void> => {
  try {
    if (!isInitialized) {
      throw new Error("RevenueCat not initialized");
    }
    await Purchases.logIn(userId);
    logger.log(`[RevenueCat] User ID set: ${userId}`);
  } catch (error) {
    logger.error("[RevenueCat] Failed to set user ID", error as Error);
    throw error;
  }
};

/**
 * Get trial information from customer info
 * @param entitlementId - Entitlement ID to check (default: EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID)
 * @returns Trial information including active status, end date, and days remaining
 */
export const getTrialInfo = async (
  entitlementId: string = ENTITLEMENT_ID
): Promise<{
  isInTrial: boolean;
  trialEndDate: Date | null;
  daysRemaining: number | null;
} | null> => {
  try {
    const customerInfo = await getCustomerInfo();
    if (!customerInfo) {
      return { isInTrial: false, trialEndDate: null, daysRemaining: null };
    }

    const entitlement = customerInfo.entitlements.active[entitlementId];
    if (!entitlement) {
      return { isInTrial: false, trialEndDate: null, daysRemaining: null };
    }

    // Check if user is in trial period
    const isInTrial = entitlement.periodType === "trial";
    const trialEndDate = entitlement.expirationDate ? new Date(entitlement.expirationDate) : null;

    let daysRemaining = null;
    if (isInTrial && trialEndDate) {
      const now = new Date();
      const diff = trialEndDate.getTime() - now.getTime();
      daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    logger.log(`[RevenueCat] Trial info: isInTrial=${isInTrial}, daysRemaining=${daysRemaining}`);
    return { isInTrial, trialEndDate, daysRemaining };
  } catch (error) {
    logger.error("[RevenueCat] Failed to get trial info", error as Error);
    return null;
  }
};

/**
 * Log out current user
 */
export const logOut = async (): Promise<CustomerInfo | null> => {
  try {
    if (!isInitialized) {
      throw new Error("RevenueCat not initialized");
    }
    const customerInfo = await Purchases.logOut();
    logger.log("[RevenueCat] User logged out");
    return customerInfo;
  } catch (error) {
    logger.error("[RevenueCat] Failed to log out", error as Error);
    throw error;
  }
};

/**
 * RevenueCat Service Object
 */
export const revenueCatService = {
  initialize: initializeRevenueCat,
  getCustomerInfo,
  getOfferings,
  purchasePackage,
  restorePurchases,
  hasActiveSubscription,
  setUserId,
  logOut,
  getTrialInfo,
  isInitialized: () => isInitialized,
};

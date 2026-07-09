/**
 * Paywall Feature Module
 * Central export for paywall feature
 */

export type {
  PaywallConfig,
  PaywallConfigByLanguage,
  PaywallFeature,
} from "./config/paywall-config";
export {
  defaultPaywallConfigByLanguage,
  getDefaultPaywallConfig,
  getPaywallConfigForVariant,
  paywallVariantsByLanguage,
} from "./config/paywall-config";
export { PaywallScreen } from "./screens/paywall-screen";
export { paywallStorageService } from "./services/paywall-storage.service";
export type { PaywallPackage, PaywallState } from "./types";

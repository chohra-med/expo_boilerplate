/**
 * Paywall Types
 */

export interface PaywallPackage {
  identifier: string;
  packageType: string;
  product: {
    identifier: string;
    description: string;
    title: string;
    price: string;
    priceString: string;
    currencyCode: string;
    introPrice?: {
      price: string;
      priceString: string;
      period: string;
      cycles: number;
    };
  };
}

export interface PaywallState {
  isLoading: boolean;
  offerings: PaywallPackage[] | null;
  selectedPackage: PaywallPackage | null;
  error: string | null;
  isPurchasing: boolean;
}

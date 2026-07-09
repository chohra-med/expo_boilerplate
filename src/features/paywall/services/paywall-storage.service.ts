import { store } from "#root/store/store";
import {
  clearSkipTimestamp,
  selectHoursUntilNextShow,
  selectShouldShowPaywall,
  setSkipTimestamp,
} from "../store";

/**
 * Paywall Storage Service
 * Handles storing and checking paywall skip timestamps using Redux
 */
class PaywallStorageService {
  private static instance: PaywallStorageService;

  static getInstance(): PaywallStorageService {
    if (!PaywallStorageService.instance) {
      PaywallStorageService.instance = new PaywallStorageService();
    }
    return PaywallStorageService.instance;
  }

  /**
   * Save the timestamp when user skips the paywall
   */
  saveSkipTimestamp(): void {
    try {
      const timestamp = Date.now();
      store.dispatch(setSkipTimestamp(timestamp));
    } catch (error) {
      console.error("[PaywallStorage] Failed to save skip timestamp:", error);
    }
  }

  /**
   * Get the timestamp when user last skipped the paywall
   * @returns Timestamp in milliseconds or null if never skipped
   */
  getSkipTimestamp(): number | null {
    try {
      const state = store.getState();
      return state.paywall.skipTimestamp;
    } catch (error) {
      console.error("[PaywallStorage] Failed to get skip timestamp:", error);
      return null;
    }
  }

  /**
   * Check if paywall should be shown
   * Returns false if user skipped within the last 48 hours
   * @returns true if paywall should be shown, false otherwise
   */
  shouldShowPaywall(): boolean {
    try {
      const state = store.getState();
      return selectShouldShowPaywall(state);
    } catch (error) {
      console.error("[PaywallStorage] Failed to check if should show paywall:", error);
      // On error, show paywall to be safe
      return true;
    }
  }

  /**
   * Clear the skip timestamp (useful for testing or reset)
   */
  clearSkipTimestamp(): void {
    try {
      store.dispatch(clearSkipTimestamp());
    } catch (error) {
      console.error("[PaywallStorage] Failed to clear skip timestamp:", error);
    }
  }

  /**
   * Get hours remaining until paywall can be shown again
   * @returns Number of hours remaining, or 0 if can show now
   */
  getHoursUntilNextShow(): number {
    try {
      const state = store.getState();
      return selectHoursUntilNextShow(state);
    } catch (error) {
      console.error("[PaywallStorage] Failed to get hours until next show:", error);
      return 0;
    }
  }
}

export const paywallStorageService = PaywallStorageService.getInstance();

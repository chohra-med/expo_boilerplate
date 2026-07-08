import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PaywallState {
  skipTimestamp: number | null;
  isLoading: boolean;
  error: string | null;
  trialReminders: {
    twoDayReminderSent: boolean;
    oneDayReminderSent: boolean;
    lastCheckedDate: number | null;
  };
}

const initialState: PaywallState = {
  skipTimestamp: null,
  isLoading: false,
  error: null,
  trialReminders: {
    twoDayReminderSent: false,
    oneDayReminderSent: false,
    lastCheckedDate: null,
  },
};

const PAYWALL_SKIP_COOLDOWN_HOURS = 48;

/**
 * Paywall slice
 * Manages paywall skip timestamp and display logic
 */
const paywallSlice = createSlice({
  name: "paywall",
  initialState,
  reducers: {
    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Set error state
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Save skip timestamp
     */
    setSkipTimestamp: (state, action: PayloadAction<number>) => {
      state.skipTimestamp = action.payload;
    },

    /**
     * Clear skip timestamp
     */
    clearSkipTimestamp: (state) => {
      state.skipTimestamp = null;
    },

    /**
     * Mark trial reminder as sent
     */
    markTrialReminderSent: (state, action: PayloadAction<"twoDay" | "oneDay">) => {
      if (action.payload === "twoDay") {
        state.trialReminders.twoDayReminderSent = true;
      } else {
        state.trialReminders.oneDayReminderSent = true;
      }
      state.trialReminders.lastCheckedDate = Date.now();
    },

    /**
     * Update last checked date for trial reminders
     */
    updateTrialReminderCheckDate: (state) => {
      state.trialReminders.lastCheckedDate = Date.now();
    },

    /**
     * Reset trial reminders (e.g., when new trial starts)
     */
    resetTrialReminders: (state) => {
      state.trialReminders.twoDayReminderSent = false;
      state.trialReminders.oneDayReminderSent = false;
      state.trialReminders.lastCheckedDate = null;
    },

    /**
     * Reset paywall state
     */
    resetPaywall: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setSkipTimestamp,
  clearSkipTimestamp,
  markTrialReminderSent,
  updateTrialReminderCheckDate,
  resetTrialReminders,
  resetPaywall,
} = paywallSlice.actions;

export const paywallReducer = paywallSlice.reducer;

/**
 * Selectors
 */
export const selectSkipTimestamp = (state: { paywall: PaywallState }) =>
  state.paywall.skipTimestamp;

export const selectShouldShowPaywall = (state: { paywall: PaywallState }) => {
  const skipTimestamp = state.paywall.skipTimestamp;

  // If never skipped, show paywall
  if (!skipTimestamp) {
    return true;
  }

  // Calculate time difference in hours
  const now = Date.now();
  const timeDiffMs = now - skipTimestamp;
  const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

  // Show paywall if 48 hours have passed
  return timeDiffHours >= PAYWALL_SKIP_COOLDOWN_HOURS;
};

export const selectHoursUntilNextShow = (state: { paywall: PaywallState }) => {
  const skipTimestamp = state.paywall.skipTimestamp;

  if (!skipTimestamp) {
    return 0;
  }

  const now = Date.now();
  const timeDiffMs = now - skipTimestamp;
  const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
  const hoursRemaining = PAYWALL_SKIP_COOLDOWN_HOURS - timeDiffHours;

  return Math.max(0, Math.ceil(hoursRemaining));
};

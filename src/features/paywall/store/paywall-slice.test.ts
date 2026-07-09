import {
  type PaywallState,
  selectHoursUntilNextShow,
  selectShouldShowPaywall,
} from "./paywall-slice";

// The selectors only read state.paywall.skipTimestamp, but we build a full,
// correctly-shaped RootState slice so the fixtures stay honest.
const HOUR_MS = 1000 * 60 * 60;
const NOW = 1_700_000_000_000; // fixed reference clock

const makeState = (skipTimestamp: number | null): { paywall: PaywallState } => ({
  paywall: {
    skipTimestamp,
    isLoading: false,
    error: null,
    trialReminders: {
      twoDayReminderSent: false,
      oneDayReminderSent: false,
      lastCheckedDate: null,
    },
  },
});

// skipTimestamp for "skipped N hours before NOW".
const skippedHoursAgo = (hours: number) => NOW - hours * HOUR_MS;

describe("paywall cooldown selectors (48h)", () => {
  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("selectShouldShowPaywall", () => {
    it("shows the paywall when it was never skipped", () => {
      expect(selectShouldShowPaywall(makeState(null))).toBe(true);
      // skipTimestamp of 0 is also treated as "never skipped".
      expect(selectShouldShowPaywall(makeState(0))).toBe(true);
    });

    it("suppresses the paywall within the 48h cooldown", () => {
      expect(selectShouldShowPaywall(makeState(skippedHoursAgo(1)))).toBe(false);
      expect(selectShouldShowPaywall(makeState(skippedHoursAgo(47)))).toBe(false);
      // Just under the boundary.
      expect(selectShouldShowPaywall(makeState(skippedHoursAgo(47.99)))).toBe(false);
    });

    it("shows again once >= 48h have passed (inclusive boundary)", () => {
      expect(selectShouldShowPaywall(makeState(skippedHoursAgo(48)))).toBe(true);
      expect(selectShouldShowPaywall(makeState(skippedHoursAgo(72)))).toBe(true);
    });
  });

  describe("selectHoursUntilNextShow", () => {
    it("returns 0 when never skipped", () => {
      expect(selectHoursUntilNextShow(makeState(null))).toBe(0);
      expect(selectHoursUntilNextShow(makeState(0))).toBe(0);
    });

    it("returns the full window when just skipped", () => {
      expect(selectHoursUntilNextShow(makeState(NOW))).toBe(48);
    });

    it("computes remaining hours, rounded up", () => {
      // 10h elapsed -> 38h remaining.
      expect(selectHoursUntilNextShow(makeState(skippedHoursAgo(10)))).toBe(38);
      // 10.5h elapsed -> 37.5h remaining -> ceil -> 38.
      expect(selectHoursUntilNextShow(makeState(skippedHoursAgo(10.5)))).toBe(38);
      // 47h elapsed -> 1h remaining.
      expect(selectHoursUntilNextShow(makeState(skippedHoursAgo(47)))).toBe(1);
    });

    it("never returns a negative value once the window has elapsed", () => {
      expect(selectHoursUntilNextShow(makeState(skippedHoursAgo(48)))).toBe(0);
      expect(selectHoursUntilNextShow(makeState(skippedHoursAgo(100)))).toBe(0);
    });
  });
});

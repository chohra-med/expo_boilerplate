/**
 * Deterministic tests for the `test_`-key release guard in
 * initializeRevenueCat (revenuecat.service.ts ~L56-62).
 *
 * A RevenueCat "Test Store" key (test_...) in a release build makes the native
 * SDK crash the app, so init must be skipped. We mock the native Purchases
 * module and the logger, and pass the api key via config so the test never
 * depends on Platform / env, and never touches native.
 */

// Mock the native RevenueCat module — no real SDK, no native calls.
jest.mock("react-native-purchases", () => ({
  __esModule: true,
  default: {
    configure: jest.fn().mockResolvedValue(undefined),
    logIn: jest.fn().mockResolvedValue(undefined),
    setLogLevel: jest.fn(),
    LOG_LEVEL: { DEBUG: "DEBUG" },
  },
}));

// Mock the logger so warnings/errors don't hit real transports.
jest.mock("../logging/logger", () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const REAL_KEY = "goog_realproductionkey123";
const TEST_KEY = "test_deadbeefdeadbeef";

// __DEV__ is a RN global; save/restore around each test.
const ORIGINAL_DEV = (global as { __DEV__?: boolean }).__DEV__;
const setDev = (value: boolean) => {
  (global as { __DEV__?: boolean }).__DEV__ = value;
};

// Re-require the module graph fresh each test so the module-level
// `isInitialized` flag never leaks between cases.
const load = () => {
  const Purchases = require("react-native-purchases").default as {
    configure: jest.Mock;
    logIn: jest.Mock;
    setLogLevel: jest.Mock;
    LOG_LEVEL: { DEBUG: string };
  };
  const { initializeRevenueCat } =
    require("./revenuecat.service") as typeof import("./revenuecat.service");
  return { Purchases, initializeRevenueCat };
};

describe("initializeRevenueCat — test_ key release guard", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    setDev(ORIGINAL_DEV as boolean);
  });

  it("rejects a test_ key in a release build (skips init, does NOT configure)", async () => {
    setDev(false); // release build
    const { Purchases, initializeRevenueCat } = load();

    const result = await initializeRevenueCat({ apiKey: TEST_KEY });

    expect(result).toBe(false);
    expect(Purchases.configure).not.toHaveBeenCalled();
    // Still not initialized after the guard trips.
    const { revenueCatService } = require("./revenuecat.service");
    expect(revenueCatService.isInitialized()).toBe(false);
  });

  it("proceeds with a real (goog_) key in a release build", async () => {
    setDev(false); // release build
    const { Purchases, initializeRevenueCat } = load();

    const result = await initializeRevenueCat({ apiKey: REAL_KEY });

    expect(result).toBe(true);
    expect(Purchases.configure).toHaveBeenCalledWith({ apiKey: REAL_KEY });
    const { revenueCatService } = require("./revenuecat.service");
    expect(revenueCatService.isInitialized()).toBe(true);
  });

  it("allows a test_ key in a dev build (configures normally + enables debug logs)", async () => {
    setDev(true); // dev build
    const { Purchases, initializeRevenueCat } = load();

    const result = await initializeRevenueCat({ apiKey: TEST_KEY });

    expect(result).toBe(true);
    expect(Purchases.configure).toHaveBeenCalledWith({ apiKey: TEST_KEY });
    // In dev the SDK debug log level is turned on.
    expect(Purchases.setLogLevel).toHaveBeenCalledWith("DEBUG");
    const { revenueCatService } = require("./revenuecat.service");
    expect(revenueCatService.isInitialized()).toBe(true);
  });
});

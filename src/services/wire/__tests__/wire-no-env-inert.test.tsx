/**
 * THE proof that matters most for a boilerplate: with NO `EXPO_PUBLIC_WIREAI_*` env vars set,
 * every Wire AI surface is INERT.
 *
 * This is what a stranger cloning the template experiences on their very first `yarn start`.
 * They have no Wire key and are not going to get one before deciding whether the repo works, so
 * "Wire is present" must cost them exactly nothing: no crash, no thrown promise, no network
 * call, and no wall of console noise implying something is broken.
 *
 * ⚠️ These tests are the guard on that promise. If one goes red, do NOT relax the assertion —
 * a Wire surface has started doing something on its own with no configuration, and that ships
 * to every buyer AND to the public Lite template.
 *
 * Falsification (run this when you change the guards, to prove the tests still bite): make
 * `getWireConfig()` return a hard-coded config instead of reading the env. Every test below
 * except the console ones must go red.
 */
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { WireProvider } from "#root/ui/providers/wire-provider";
import {
  buildWirePermissionScreens,
  createWireGateStorage,
  createWirePurchaseFunnel,
  getWireConfig,
  getWireFeaturesConfig,
  getWireTarget,
  isWireEnabled,
  resetWireConfigCache,
} from "../index";

const WIRE_ENV_VARS = [
  "EXPO_PUBLIC_WIREAI_API_KEY",
  "EXPO_PUBLIC_WIREAI_SERVER_URL",
  "EXPO_PUBLIC_WIREAI_APP_ID",
] as const;

/** Strip the Wire env, exactly as a fresh clone has it. */
const clearWireEnv = (): void => {
  for (const name of WIRE_ENV_VARS) {
    delete process.env[name];
  }
};

describe("Wire AI integration with NO env configured", () => {
  let fetchSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    clearWireEnv();
    // The env memo is a module-scope latch by design (that is the whole point — one read per
    // process). Reset it here rather than resetting MODULES: `jest.resetModules()` would hand
    // this file a second copy of React and break every render below.
    resetWireConfigCache();

    // Any call at all is a failure: nothing here may reach the network unconfigured.
    fetchSpy = jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.reject(new Error("network must not be reached")));
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe("the shared config reader", () => {
    it("resolves no config, so every surface downstream is off", () => {
      expect(getWireConfig()).toBeNull();
      expect(isWireEnabled()).toBe(false);
      expect(getWireTarget()).toBeUndefined();
      expect(getWireFeaturesConfig()).toBeUndefined();
    });

    it("reads the environment ONCE per process, however many surfaces ask", () => {
      // Twelve reads across the four getters — the shape a real app produces when the
      // provider, the onboarding screen, both gates and the paywall all mount.
      for (let i = 0; i < 3; i += 1) {
        getWireConfig();
        isWireEnabled();
        getWireTarget();
        getWireFeaturesConfig();
      }

      // The kit warns (dev-only, correctly) that the key is missing, and it has NO once-latch
      // of its own — it warns per call. The memo is what bounds that to a single notice, so a
      // fresh clone gets one honest line instead of a growing pile of identical ones.
      // ⚠️ If this number climbs, the memo has been broken and every Wire surface is
      // re-parsing the env on every render.
      expect(warnSpy.mock.calls.length).toBeLessThanOrEqual(1);
    });

    it("never logs an error", () => {
      getWireConfig();
      isWireEnabled();

      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe("the purchase funnel", () => {
    it("is a no-op that constructs no analytics instance and touches no network", () => {
      const funnel = createWirePurchaseFunnel({ entitlementId: "pro" });

      expect(funnel.isActive).toBe(false);

      // A realistic package, matching the kit's structural RevenueCat types — NOT a `{}` cast.
      // A fixture thinner than the real shape would let a null-deref inside the bridge pass here
      // and blow up on a real device.
      const pkg = {
        identifier: "monthly",
        packageType: "MONTHLY",
        product: { identifier: "pro_monthly", price: 4.99, currencyCode: "EUR" },
      };

      // Every method callable with realistic arguments, none of them throwing.
      expect(() => {
        funnel.paywallShown(undefined, { variant: "control" });
        funnel.checkoutStarted(pkg, { variant: "control" });
        funnel.purchaseCompleted({ entitlements: { active: {} } }, pkg);
        funnel.purchaseFailed(new Error("boom"), pkg);
        funnel.purchasesRestored({ entitlements: { active: {} } });
        funnel.syncPlanTier({ entitlements: { active: {} } });
      }).not.toThrow();

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("returns void from every method, so no caller can branch on it", () => {
      const funnel = createWirePurchaseFunnel({ entitlementId: "pro" });

      // The kit's own bridge answers "is entitled now" here. Narrowing to void is what makes
      // it impossible for a paywall to unlock on a value that means nothing when Wire is off.
      expect(funnel.purchaseCompleted({ entitlements: { active: {} } })).toBeUndefined();
      expect(funnel.purchasesRestored({ entitlements: { active: {} } })).toBeUndefined();
    });
  });

  describe("permission screens", () => {
    it("builds NO screens, so the onboarding flow is unchanged", () => {
      const request = jest.fn();

      const screens = buildWirePermissionScreens({ notifications: { request } }, false);

      expect(screens).toEqual([]);
      // The one function that can open an OS dialog was never even referenced.
      expect(request).not.toHaveBeenCalled();
    });

    it("still builds them when a transport IS configured (the guard is the env, not a stub)", () => {
      const request = jest.fn();

      const screens = buildWirePermissionScreens({ notifications: { request } }, true);

      expect(screens).toHaveLength(1);
      expect(screens[0].permission).toBe("notifications");
      expect(screens[0].placement).toBe("beforeEnd");
      // Still never CALLED — only the kit's primary tap may call it.
      expect(request).not.toHaveBeenCalled();
    });
  });

  describe("the gate storage", () => {
    it("survives a throwing backend in both directions", () => {
      const storage = createWireGateStorage({
        read: () => {
          throw new Error("locked");
        },
        write: () => {
          throw new Error("full");
        },
      });

      // Fail-closed on read: an unreadable counter reads as "not enough sessions yet",
      // so the gate stays SHUT rather than ambushing a first-run user.
      expect(storage.getItem("wire_review_x_sessions")).toBeNull();
      expect(() => storage.setItem("wire_review_x_sessions", "3")).not.toThrow();
    });
  });

  describe("the provider", () => {
    it("renders its children and never fetches the kill switches", () => {
      const { getByText } = render(
        <WireProvider featuresConfig={getWireFeaturesConfig()}>
          <Text>app</Text>
        </WireProvider>
      );

      expect(getByText("app")).toBeTruthy();
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });
});

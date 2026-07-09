import { type AnalyticsParams, sanitizeParams } from "./params";

describe("sanitizeParams", () => {
  it("returns undefined when no params are given", () => {
    expect(sanitizeParams()).toBeUndefined();
    expect(sanitizeParams(undefined)).toBeUndefined();
  });

  it("returns an empty object for empty input", () => {
    expect(sanitizeParams({})).toEqual({});
  });

  it("drops null and undefined values (but keeps falsy 0 / empty string / false)", () => {
    const out = sanitizeParams({
      kept_number: 0,
      kept_string: "",
      kept_bool: false,
      dropped_null: null,
      dropped_undefined: undefined,
    });
    expect(out).toEqual({ kept_number: 0, kept_string: "", kept_bool: 0 });
  });

  // ---- PII denylist -------------------------------------------------------
  describe("PII denylist", () => {
    // Every needle on the denylist, embedded as a substring, must be stripped.
    const piiCases: Array<[string, string]> = [
      ["email", "user_email"],
      ["password", "password"],
      ["phone", "phone_number"],
      ["first_name", "first_name"],
      ["last_name", "last_name"],
      ["full_name", "full_name"],
      ["username", "username"],
      ["address", "billing_address"],
      ["token", "auth_token"],
      ["lat", "device_lat"],
      ["lng", "device_lng"],
      ["latitude", "latitude"],
      ["longitude", "longitude"],
      ["dob", "user_dob"],
      ["birth", "birthdate"],
      ["ssn", "ssn"],
      ["card", "card_number"],
      ["secret", "client_secret"],
      ["authorization", "authorization"],
    ];

    it.each(piiCases)("strips key containing %s (%s)", (_needle, key) => {
      const out = sanitizeParams({ [key]: "sensitive", safe_key: "ok" });
      expect(out).not.toHaveProperty(key);
      // A non-PII key alongside it survives.
      expect(out).toEqual({ safe_key: "ok" });
    });

    it("matches PII case-insensitively", () => {
      const out = sanitizeParams({ User_EMAIL: "x@y.com", Country: "DE" });
      expect(out).toEqual({ Country: "DE" });
    });

    it("keeps benign keys that do not contain any denylisted substring", () => {
      const out = sanitizeParams({ feature_name: "sample", step_index: 2 });
      expect(out).toEqual({ feature_name: "sample", step_index: 2 });
    });
  });

  // ---- Firebase clamp boundaries -----------------------------------------
  describe("Firebase clamping", () => {
    it("never emits a client-supplied timestamp", () => {
      const out = sanitizeParams({ timestamp: 123456789, other: "keep" });
      expect(out).toEqual({ other: "keep" });
    });

    it("coerces booleans to 1/0 (Firebase has no bool param type)", () => {
      expect(sanitizeParams({ flag: true })).toEqual({ flag: 1 });
      expect(sanitizeParams({ flag: false })).toEqual({ flag: 0 });
    });

    it("keeps finite numbers and coerces non-finite numbers to 0", () => {
      const out = sanitizeParams({
        finite: 42,
        negative: -7.5,
        infinite: Number.POSITIVE_INFINITY,
        nan: Number.NaN,
      });
      expect(out).toEqual({ finite: 42, negative: -7.5, infinite: 0, nan: 0 });
    });

    it("truncates string values to <= 100 chars", () => {
      const long = "a".repeat(200);
      const short = "b".repeat(40);
      const out = sanitizeParams({ long, short }) as AnalyticsParams;
      expect(out.long).toHaveLength(100);
      expect(out.long).toBe("a".repeat(100));
      // A value below the limit is left untouched.
      expect(out.short).toBe(short);
    });

    it("serializes objects/arrays to a JSON string, then clamps to 100 chars", () => {
      const out = sanitizeParams({ obj: { a: 1, b: "two" } }) as AnalyticsParams;
      expect(out.obj).toBe(JSON.stringify({ a: 1, b: "two" }));

      const bigArray = Array.from({ length: 200 }, (_, i) => i);
      const out2 = sanitizeParams({ arr: bigArray }) as AnalyticsParams;
      expect(typeof out2.arr).toBe("string");
      expect((out2.arr as string).length).toBe(100);
    });

    it("truncates keys to <= 40 chars", () => {
      const longKey = "z".repeat(50); // no PII substring
      const out = sanitizeParams({ [longKey]: "v" }) as AnalyticsParams;
      const keys = Object.keys(out);
      expect(keys).toHaveLength(1);
      expect(keys[0]).toHaveLength(40);
      expect(keys[0]).toBe("z".repeat(40));
    });

    it("keeps at most 25 params and drops the overflow", () => {
      const input: AnalyticsParams = {};
      for (let i = 0; i < 30; i++) {
        input[`k${i}`] = i;
      }
      const out = sanitizeParams(input) as AnalyticsParams;
      expect(Object.keys(out)).toHaveLength(25);
      // The first 25 insertion-ordered keys are the ones kept.
      expect(out.k0).toBe(0);
      expect(out.k24).toBe(24);
      expect(out).not.toHaveProperty("k25");
      expect(out).not.toHaveProperty("k29");
    });

    it("does not count PII-stripped keys against the 25-param budget", () => {
      const input: AnalyticsParams = {};
      // 5 PII keys that must be stripped, then 25 valid keys.
      for (let i = 0; i < 5; i++) {
        input[`email_${i}`] = "x";
      }
      for (let i = 0; i < 25; i++) {
        input[`valid_${i}`] = i;
      }
      const out = sanitizeParams(input) as AnalyticsParams;
      expect(Object.keys(out)).toHaveLength(25);
      expect(out.valid_0).toBe(0);
      expect(out.valid_24).toBe(24);
    });
  });
});

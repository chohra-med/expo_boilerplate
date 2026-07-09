import { coachmarkStorage } from "./coachmark-storage";
import { mmkv } from "./mmkv-storage";

const getString = mmkv.getString as jest.Mock;
const set = mmkv.set as jest.Mock;

describe("coachmarkStorage (sync MMKV adapter)", () => {
  beforeEach(() => {
    getString.mockReset();
    set.mockReset();
  });

  it("returns the stored string for a present key", () => {
    getString.mockReturnValue("seen");
    expect(coachmarkStorage.getItem("wire_coachmark_home_seen")).toBe("seen");
    expect(getString).toHaveBeenCalledWith("wire_coachmark_home_seen");
  });

  it("coalesces a missing key (MMKV returns undefined) to null", () => {
    getString.mockReturnValue(undefined);
    // The kit's gate contract is `string | null`; a bare undefined would break it.
    expect(coachmarkStorage.getItem("never_written")).toBeNull();
  });

  it("writes through to the shared MMKV instance", () => {
    coachmarkStorage.setItem("wire_showcase_intro_seen", "1");
    expect(set).toHaveBeenCalledWith("wire_showcase_intro_seen", "1");
  });
});

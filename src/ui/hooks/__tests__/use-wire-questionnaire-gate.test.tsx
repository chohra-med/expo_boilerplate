/**
 * The questionnaire gate's ENV guard, isolated.
 *
 * @description Why this file exists, and it is worth remembering: the component-level no-env
 * test for `WireQuestionnaireGate` stayed GREEN when the env guard was deliberately broken.
 * It was never proving the env gate at all — the jest MMKV mock returns nothing, so the
 * app-open counter is pinned at 1, the `minSessions: 3` floor is unsatisfiable, and the gate
 * was shut for a completely different reason. A test that passes for the wrong reason is worse
 * than no test, because it reads like coverage.
 *
 * So this file gives the gate a WORKING storage and a satisfiable floor, which leaves exactly
 * one thing standing between it and being visible: `enabled`. Now the guard is the only
 * variable, and breaking it turns this red.
 */
import { renderHook } from "@testing-library/react-native";
import { createInMemoryGateStorage } from "#root/services/wire";
import { useWireWhenToAskQuestionnaire } from "../use-wire-questionnaire-gate";

const config = { id: "test_gate", minSessions: 0, oncePerVersion: false } as const;

describe("useWireWhenToAskQuestionnaire", () => {
  it("is visible when Wire is configured and the local rules are satisfied", () => {
    const { result } = renderHook(() =>
      useWireWhenToAskQuestionnaire({
        config,
        storage: createInMemoryGateStorage(),
        enabled: true,
      })
    );

    // The positive control. Without this the "shut" assertions below prove nothing:
    // a gate that can NEVER open is trivially shut with or without a guard.
    expect(result.current.visible).toBe(true);
  });

  it("is shut when Wire is NOT configured, with everything else identical", () => {
    const { result } = renderHook(() =>
      useWireWhenToAskQuestionnaire({
        config,
        storage: createInMemoryGateStorage(),
        enabled: false,
      })
    );

    expect(result.current.visible).toBe(false);
  });

  it("is shut while the host suppresses it, even with Wire configured", () => {
    const { result } = renderHook(() =>
      useWireWhenToAskQuestionnaire({
        config,
        storage: createInMemoryGateStorage(),
        enabled: true,
        suppressed: true,
      })
    );

    expect(result.current.visible).toBe(false);
  });

  it("does not burn the once-per-user record while it is shut", () => {
    const storage = createInMemoryGateStorage();
    const setItem = jest.spyOn(storage, "setItem");

    const { result } = renderHook(() =>
      useWireWhenToAskQuestionnaire({ config, storage, enabled: false })
    );

    setItem.mockClear();
    result.current.markShown();
    result.current.markResolved();

    // A gate that was never SHOWN must not write "seen": that record is permanent, and writing
    // it here would mean the questionnaire can never be shown once Wire IS switched on.
    expect(setItem).not.toHaveBeenCalled();
  });
});

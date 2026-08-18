/**
 * useWireWhenToAskQuestionnaire — the WHEN decision for the Wire questionnaire popup.
 *
 * @description Wraps the kit's `useQuestionnaireGate` with the three bindings every launcher
 * tier needs identically, so no tier re-authors them:
 *   1. the ENV GATE — with no Wire transport the gate is forced shut, so a fresh clone never
 *      shows a feedback popup it has no server to send answers to;
 *   2. the sync gate STORAGE, so the app-open counter actually counts (without one the kit
 *      warns, in dev, that the counter is pinned at 1 and the fail-closed `minSessions` floor
 *      can therefore never be met); and
 *   3. a host SUPPRESSION flag, so an app can keep this popup off the screen while another
 *      modal (typically the review gate) owns the moment. The kit coordinates neither.
 *
 * The kit's own master kill switch still composes on top: when `questionnaire.enabled` is false
 * on the dashboard the gate never fires, whatever the local rules or a server decision say. It
 * reads that flag from the `WireFeaturesProvider` above automatically.
 *
 * @example
 * ```typescript
 * const gate = useWireWhenToAskQuestionnaire({
 *   config: { id: 'app_feedback', minSessions: 3 },
 *   storage: wireGateStorage,
 *   enabled: isWireEnabled(),
 *   suppressed: reviewArmed,
 * });
 * if (!gate.visible) return null;
 * ```
 */
import type {
  QuestionnaireDecision,
  QuestionnaireDefinition,
  QuestionnaireGateController,
} from "@wireai/activation/questionnaire";
import { useQuestionnaireGate } from "@wireai/activation/questionnaire";
import { useMemo } from "react";

/** The sync store the gate counts app-opens with. Structural, so no subpath import is needed. */
export interface WireQuestionnaireGateStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export interface UseWireQuestionnaireGateOptions {
  /** The questionnaire id + local firing rules. */
  config: QuestionnaireDefinition;
  /** Sync gate storage. Strongly recommended: without it the counter never leaves 1. */
  storage: WireQuestionnaireGateStorage;
  /** Whether a Wire transport is configured. `false` forces the gate shut. */
  enabled: boolean;
  /** Server-provided decision, which OVERRIDES the local rules when present. */
  decision?: QuestionnaireDecision;
  /** Host-owned tracked app-event count, for the `minEvents` rule. */
  events?: number;
  /** Hold the gate shut while something else owns the screen (e.g. the review prompt). */
  suppressed?: boolean;
}

/**
 * Decide whether the questionnaire popup may show right now.
 *
 * @param options The gate config, storage, and the two host-owned gates.
 * @returns The kit's controller. `visible` is `false` whenever Wire is off or the host
 * suppressed it, and `markShown` / `markResolved` become no-ops in that state so a suppressed
 * gate can never burn its once-per-user record.
 */
export const useWireWhenToAskQuestionnaire = ({
  config,
  storage,
  enabled,
  decision,
  events,
  suppressed = false,
}: UseWireQuestionnaireGateOptions): QuestionnaireGateController => {
  const off = !enabled || suppressed;

  // Force the gate shut through the kit's OWN local rule rather than by skipping the hook:
  // the rules of hooks forbid the conditional call, and `enabled: false` is the documented
  // master local switch. The gate then reports `visible: false` with a real verdict, so
  // analytics and debugging still see a decision rather than an absence.
  const gateConfig = useMemo<QuestionnaireDefinition>(
    () => (off ? { ...config, enabled: false } : config),
    [off, config]
  );

  const gate = useQuestionnaireGate({
    config: gateConfig,
    decision: off ? undefined : decision,
    events,
    storage,
  });

  // A suppressed/disabled gate must not write its once-per-user seen record: the popup was
  // never shown, and burning the record here would mean it can NEVER be shown later.
  return useMemo<QuestionnaireGateController>(
    () =>
      off
        ? {
            visible: false,
            decision: gate.decision,
            markShown: () => undefined,
            markResolved: () => undefined,
          }
        : gate,
    [off, gate]
  );
};

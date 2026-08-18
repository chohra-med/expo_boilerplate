import type {
  QuestionnaireDefinition,
  QuestionnaireGateEvent,
} from "@wireai/activation/questionnaire";
import { QuestionnaireGate } from "@wireai/activation/questionnaire";
import type React from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { logger } from "#root/services/logging";
import { getWireTarget, isWireEnabled } from "#root/services/wire";
import { useWireWhenToAskQuestionnaire } from "#root/ui/hooks";
import { wireGateStorage } from "../services/wire-gate-storage";

/**
 * Wire AI questionnaire gate — the in-app feedback popup, server-decidable and fail-closed.
 *
 * @description Three questions, one per step: two skippable, then one REQUIRED, so every
 * completed run carries at least one real answer. Answers are POSTed to the Wire server and
 * never touch analytics props.
 *
 * Safe-by-default, and there are FOUR independent gates in front of it, any one of which keeps
 * it shut:
 *   1. no Wire env configured → `isWireEnabled()` is false and the gate is forced off, so a
 *      fresh clone of this template never shows a popup it has no server to answer to;
 *   2. the dashboard `questionnaire` master kill switch (read from `WireProvider`'s
 *      `WireFeaturesProvider` automatically) — fail-open, so an unreachable control plane
 *      leaves the local rules in charge rather than darkening the app;
 *   3. the local rules — `minSessions` app-opens on this device, once per app version; and
 *   4. `suppressed`, so this never lands on top of another modal. Both are centered modals, so
 *      without this flag two could show at once.
 *
 * @inventory
 */

/** The gate id. Keys the kit's `wire_questionnaire_*` session / seen / last-shown storage. */
const QUESTIONNAIRE_ID = "app_feedback";

/**
 * App-opens required before the questionnaire may fire. Asking a user to WRITE something costs
 * more than a tap, so it should never be the first thing a new install is interrupted by.
 */
const MIN_SESSIONS = 3;

interface WireQuestionnaireGateProps {
  /** Hold the popup shut while something else owns the moment. */
  suppressed?: boolean;
}

export const WireQuestionnaireGate: React.FC<WireQuestionnaireGateProps> = ({
  suppressed = false,
}) => {
  const { t } = useTranslation();

  // Env is read once per process by the shared config module; this is a memo read, not a parse.
  const enabled = isWireEnabled();
  const target = useMemo(() => getWireTarget(), []);

  const questionnaire = useMemo<QuestionnaireDefinition>(
    () => ({
      id: QUESTIONNAIRE_ID,
      opinion_label: t("wire.questionnaire.opinionLabel"),
      improve_label: t("wire.questionnaire.improveLabel"),
      suggestions_label: t("wire.questionnaire.suggestionsLabel"),
      minSessions: MIN_SESSIONS,
      oncePerVersion: true,
    }),
    [t]
  );

  const gate = useWireWhenToAskQuestionnaire({
    config: questionnaire,
    storage: wireGateStorage,
    enabled,
    suppressed,
  });

  const handleShown = useCallback(() => {
    gate.markShown();
  }, [gate]);

  const handleResolved = useCallback(() => {
    gate.markResolved();
  }, [gate]);

  const handleEvent = useCallback((event: QuestionnaireGateEvent) => {
    // Gate id only. The free-text answers ride ONLY in the POST body, never in analytics.
    logger.logEvent("wire_questionnaire_event", { name: event.name, id: event.id });
  }, []);

  if (!gate.visible) {
    return null;
  }

  return (
    <QuestionnaireGate
      questionnaire={questionnaire}
      target={target}
      onShown={handleShown}
      onResolved={handleResolved}
      onEvent={handleEvent}
    />
  );
};

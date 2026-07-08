/**
 * useFunnel — typed onboarding funnel keyed to EVENTS.ONB_*.
 *
 * Emits ONB_START / ONB_STEP_SHOWN / ONB_STEP_ANSWERED / ONB_STEP_SKIPPED /
 * ONB_STEP_BACK / ONB_PAYWALL_SHOWN / ONB_COMPLETE, and — critically — auto-
 * emits ONB_DROPOFF on unmount if the funnel was started but never completed.
 * That auto drop-off is the step-level abandonment signal for the KPI dashboard.
 *
 *   const funnel = useFunnel();
 *   useEffect(() => funnel.start(totalSteps), []);
 *   // when a step renders:
 *   funnel.stepShown(index, 'goal');
 *   // on answer / skip / back:
 *   funnel.stepAnswered(index, 'goal', 'single_choice');
 *   funnel.complete();
 */

import { useCallback, useEffect, useRef } from "react";

import { analytics } from "./analytics";
import { EVENTS } from "./events";
import type { AppStepId } from "./events.app";

export const useFunnel = () => {
  const started = useRef(false);
  const completed = useRef(false);
  const totalSteps = useRef<number | undefined>(undefined);
  const lastStepIndex = useRef<number>(0);
  const lastStepId = useRef<AppStepId | undefined>(undefined);
  const stepEnteredAt = useRef<number>(0);

  const timeOnStep = useCallback((): number => {
    return stepEnteredAt.current ? Date.now() - stepEnteredAt.current : 0;
  }, []);

  const start = useCallback((steps?: number) => {
    if (started.current) {
      return;
    }
    started.current = true;
    totalSteps.current = steps;
    analytics.track(EVENTS.ONB_START, { total_steps: steps });
  }, []);

  const stepShown = useCallback((stepIndex: number, stepId: AppStepId) => {
    lastStepIndex.current = stepIndex;
    lastStepId.current = stepId;
    stepEnteredAt.current = Date.now();
    analytics.track(EVENTS.ONB_STEP_SHOWN, {
      step_index: stepIndex,
      step_id: stepId,
      total_steps: totalSteps.current,
    });
  }, []);

  const stepAnswered = useCallback(
    (stepIndex: number, stepId: AppStepId, answerType?: string) => {
      analytics.track(EVENTS.ONB_STEP_ANSWERED, {
        step_index: stepIndex,
        step_id: stepId,
        answer_type: answerType,
        time_on_step_ms: timeOnStep(),
      });
    },
    [timeOnStep]
  );

  const stepSkipped = useCallback(
    (stepIndex: number, stepId: AppStepId) => {
      analytics.track(EVENTS.ONB_STEP_SKIPPED, {
        step_index: stepIndex,
        step_id: stepId,
        time_on_step_ms: timeOnStep(),
      });
    },
    [timeOnStep]
  );

  const stepBack = useCallback((stepIndex: number, stepId: AppStepId) => {
    analytics.track(EVENTS.ONB_STEP_BACK, {
      step_index: stepIndex,
      step_id: stepId,
    });
  }, []);

  const paywallShown = useCallback((source?: string) => {
    analytics.track(EVENTS.ONB_PAYWALL_SHOWN, {
      step_index: lastStepIndex.current,
      source,
    });
  }, []);

  const complete = useCallback(() => {
    if (completed.current) {
      return;
    }
    completed.current = true;
    analytics.track(EVENTS.ONB_COMPLETE, {
      total_steps: totalSteps.current,
    });
  }, []);

  // Auto drop-off: started but never completed → the user abandoned.
  useEffect(() => {
    return () => {
      if (started.current && !completed.current) {
        analytics.track(EVENTS.ONB_DROPOFF, {
          last_step_index: lastStepIndex.current,
          step_id: lastStepId.current,
          total_steps: totalSteps.current,
        });
      }
    };
  }, []);

  return {
    start,
    stepShown,
    stepAnswered,
    stepSkipped,
    stepBack,
    paywallShown,
    complete,
  };
};

export type Funnel = ReturnType<typeof useFunnel>;

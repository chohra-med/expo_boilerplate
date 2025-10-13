import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "#root/store/store";

const selectOnboarding = (state: RootState) => state.onboarding;

export const selectCurrentStep = createSelector(
  selectOnboarding,
  (onboarding) => onboarding.currentStep
);

export const selectTotalSteps = createSelector(
  selectOnboarding,
  (onboarding) => onboarding.totalSteps
);

export const selectIsOnboardingCompleted = createSelector(
  selectOnboarding,
  (onboarding) => onboarding.isCompleted
);

export const selectQuestionnaireAnswers = createSelector(
  selectOnboarding,
  (onboarding) => onboarding.questionnaireAnswers
);

export const selectCurrentLanguage = createSelector(
  selectOnboarding,
  (onboarding) => onboarding.currentLanguage
);

export const selectUserPreferences = createSelector(
  selectOnboarding,
  (onboarding) => onboarding.userPreferences
);

export const selectOnboardingState = createSelector(selectOnboarding, (onboarding) => onboarding);

// Legacy selectors for backward compatibility
export const selectQuestionnaire1Answer = createSelector(
  selectQuestionnaireAnswers,
  (answers) => answers.primary_use_case as string | undefined
);

export const selectQuestionnaire2Answer = createSelector(
  selectQuestionnaireAnswers,
  (answers) => answers.app_usage_frequency as string | undefined
);

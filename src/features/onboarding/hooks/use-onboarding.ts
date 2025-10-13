import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "#root/store/store";
import {
  selectCurrentLanguage,
  selectCurrentStep,
  selectIsOnboardingCompleted,
  selectQuestionnaireAnswers,
  selectTotalSteps,
  selectUserPreferences,
} from "../store/onboarding-selector";
import {
  completeOnboarding,
  goToStep,
  nextStep,
  previousStep,
  resetOnboarding,
  setLanguage,
  setQuestionnaire1Answer,
  setQuestionnaire2Answer,
  setQuestionnaireAnswer,
  setQuestionnaireAnswerWithQuestion,
  setQuestionnaireResponse,
} from "../store/onboarding-slice";

export const useOnboarding = () => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  const currentStep = useAppSelector(selectCurrentStep);
  const totalSteps = useAppSelector(selectTotalSteps);
  const isCompleted = useAppSelector(selectIsOnboardingCompleted);
  const questionnaireAnswers = useAppSelector(selectQuestionnaireAnswers);
  const userPreferences = useAppSelector(selectUserPreferences);
  const currentLanguage = useAppSelector(selectCurrentLanguage);

  const handleNext = useCallback(() => {
    dispatch(nextStep());
  }, [dispatch]);

  const handlePrevious = useCallback(() => {
    dispatch(previousStep());
  }, [dispatch]);

  const handleGoToStep = useCallback(
    (step: number) => {
      dispatch(goToStep(step));
    },
    [dispatch]
  );

  const handleQuestionnaireAnswer = useCallback(
    (stepId: string, answer: string | string[]) => {
      dispatch(setQuestionnaireAnswer({ stepId, answer }));
    },
    [dispatch]
  );

  const handleQuestionnaireAnswerWithQuestion = useCallback(
    (stepId: string, question: string, answer: string | string[]) => {
      dispatch(setQuestionnaireAnswerWithQuestion({ stepId, question, answer }));
    },
    [dispatch]
  );

  const handleQuestionnaireResponse = useCallback(
    (
      response: Record<
        string,
        { question: string; userAnswer: string | string[]; stepId: string; timestamp?: number }
      >
    ) => {
      dispatch(setQuestionnaireResponse(response));
    },
    [dispatch]
  );

  const handleSetLanguage = useCallback(
    (language: "en" | "fr") => {
      dispatch(setLanguage(language));
      i18n.changeLanguage(language);
    },
    [dispatch, i18n.changeLanguage]
  );

  // Legacy support
  const handleQuestionnaire1Answer = useCallback(
    (answer: string) => {
      dispatch(setQuestionnaire1Answer(answer));
    },
    [dispatch]
  );

  const handleQuestionnaire2Answer = useCallback(
    (answer: string) => {
      dispatch(setQuestionnaire2Answer(answer));
    },
    [dispatch]
  );

  const handleComplete = useCallback(() => {
    dispatch(completeOnboarding());
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(resetOnboarding());
  }, [dispatch]);

  const canGoNext = currentStep < totalSteps - 1;
  const canGoPrevious = currentStep > 0;
  const progress = (currentStep + 1) / totalSteps;

  return {
    // State
    currentStep,
    totalSteps,
    isCompleted,
    questionnaireAnswers,
    userPreferences,
    currentLanguage,
    progress,
    canGoNext,
    canGoPrevious,

    // Actions
    next: handleNext,
    previous: handlePrevious,
    goToStep: handleGoToStep,
    setQuestionnaireAnswer: handleQuestionnaireAnswer,
    setQuestionnaireAnswerWithQuestion: handleQuestionnaireAnswerWithQuestion,
    setQuestionnaireResponse: handleQuestionnaireResponse,
    setLanguage: handleSetLanguage,
    setQuestionnaire1Answer: handleQuestionnaire1Answer,
    setQuestionnaire2Answer: handleQuestionnaire2Answer,
    complete: handleComplete,
    reset: handleReset,
  };
};

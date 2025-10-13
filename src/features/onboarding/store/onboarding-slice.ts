import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OnboardingState, QuestionnaireAnswer, QuestionnaireResponse } from '../types';

const initialState: OnboardingState = {
  currentStep: 0,
  totalSteps: 7, // 3 onboarding steps + 4 questionnaire steps
  isCompleted: false,
  questionnaireAnswers: {},
  userPreferences: {},
  currentLanguage: 'en',
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps - 1) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.totalSteps) {
        state.currentStep = action.payload;
      }
    },
    setQuestionnaireAnswer: (
      state,
      action: PayloadAction<{ stepId: string; answer: string | string[] }>
    ) => {
      const { stepId, answer } = action.payload;
      state.questionnaireAnswers[stepId] = answer;

      // Ensure userPreferences is initialized
      if (!state.userPreferences) {
        state.userPreferences = {};
      }

      // Update user preferences based on stepId
      switch (stepId) {
        case 'primary_use_case':
          state.userPreferences.primaryUseCase = answer as string;
          break;
        case 'app_usage_frequency':
          state.userPreferences.appUsageFrequency = answer as string;
          break;
        case 'interests':
          state.userPreferences.interests = answer as string[];
          break;
        case 'notification_preferences':
          state.userPreferences.notificationPreferences = answer as string;
          break;
        default:
          state.userPreferences[stepId] = answer;
      }
    },
    setQuestionnaireAnswerWithQuestion: (
      state,
      action: PayloadAction<{ stepId: string; question: string; answer: string | string[] }>
    ) => {
      const { stepId, question, answer } = action.payload;

      // Store the complete answer data
      const _questionnaireAnswer: QuestionnaireAnswer = {
        question,
        userAnswer: answer,
        stepId,
        timestamp: Date.now(),
      };

      // Update the simple answers for backward compatibility
      state.questionnaireAnswers[stepId] = answer;

      // Ensure userPreferences is initialized
      if (!state.userPreferences) {
        state.userPreferences = {};
      }

      // Update user preferences based on stepId
      switch (stepId) {
        case 'primary_use_case':
          state.userPreferences.primaryUseCase = answer as string;
          break;
        case 'app_usage_frequency':
          state.userPreferences.appUsageFrequency = answer as string;
          break;
        case 'interests':
          state.userPreferences.interests = answer as string[];
          break;
        case 'notification_preferences':
          state.userPreferences.notificationPreferences = answer as string;
          break;
        default:
          state.userPreferences[stepId] = answer;
      }
    },
    setQuestionnaireResponse: (state, action: PayloadAction<QuestionnaireResponse>) => {
      const response = action.payload;

      // Update questionnaire answers from response
      Object.entries(response).forEach(([stepId, answerData]) => {
        state.questionnaireAnswers[stepId] = answerData.userAnswer;

        // Update user preferences
        if (!state.userPreferences) {
          state.userPreferences = {};
        }

        switch (stepId) {
          case 'primary_use_case':
            state.userPreferences.primaryUseCase = answerData.userAnswer as string;
            break;
          case 'app_usage_frequency':
            state.userPreferences.appUsageFrequency = answerData.userAnswer as string;
            break;
          case 'interests':
            state.userPreferences.interests = answerData.userAnswer as string[];
            break;
          case 'notification_preferences':
            state.userPreferences.notificationPreferences = answerData.userAnswer as string;
            break;
          default:
            state.userPreferences[stepId] = answerData.userAnswer;
        }
      });
    },
    setLanguage: (state, action: PayloadAction<'en' | 'fr'>) => {
      state.currentLanguage = action.payload;
    },
    completeOnboarding: (state) => {
      state.isCompleted = true;
    },
    resetOnboarding: (_state) => {
      return initialState;
    },
    // Legacy support for backward compatibility
    setQuestionnaire1Answer: (state, action: PayloadAction<string>) => {
      state.questionnaireAnswers.primary_use_case = action.payload;
      if (!state.userPreferences) {
        state.userPreferences = {};
      }
      state.userPreferences.primaryUseCase = action.payload;
    },
    setQuestionnaire2Answer: (state, action: PayloadAction<string>) => {
      state.questionnaireAnswers.app_usage_frequency = action.payload;
      if (!state.userPreferences) {
        state.userPreferences = {};
      }
      state.userPreferences.appUsageFrequency = action.payload;
    },
  },
});

export const {
  nextStep,
  previousStep,
  goToStep,
  setQuestionnaireAnswer,
  setQuestionnaireAnswerWithQuestion,
  setQuestionnaireResponse,
  setLanguage,
  completeOnboarding,
  resetOnboarding,
  setQuestionnaire1Answer,
  setQuestionnaire2Answer,
} = onboardingSlice.actions;

export const onboardingReducer = onboardingSlice.reducer;

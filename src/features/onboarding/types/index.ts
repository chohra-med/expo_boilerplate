export interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
}

export interface QuestionnaireOption {
  id: string;
  label: string;
  value: string;
}

export interface Questionnaire {
  id: string;
  title: string;
  question: string;
  options: QuestionnaireOption[];
}

export interface QuestionnaireStep {
  stepId: string;
  stepTitle: string;
  stepOptions: QuestionnaireOption[];
  multiple: boolean;
  isSkippable: boolean;
  hasOtherOption?: boolean;
  otherOptionPlaceholder?: string;
}

export interface UserPreferences {
  primaryUseCase?: string;
  appUsageFrequency?: string;
  interests?: string[];
  notificationPreferences?: string;
  [key: string]: string | string[] | undefined;
}

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  questionnaireAnswers: Record<string, string | string[]>;
  userPreferences: UserPreferences;
  currentLanguage: "en" | "fr";
}

export interface OnboardingData {
  steps: OnboardingStep[];
  questionnaires: Questionnaire[];
}

/**
 * Questionnaire answer data structure for Redux storage
 */
export interface QuestionnaireAnswer {
  question: string;
  userAnswer: string | string[];
  stepId: string;
  timestamp?: number;
}

/**
 * Complete questionnaire response data
 */
export interface QuestionnaireResponse {
  [stepId: string]: QuestionnaireAnswer;
}

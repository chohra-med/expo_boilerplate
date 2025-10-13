/**
 * Example usage of the new Onboarding_Questionnaires configuration system
 *
 * This file demonstrates how to:
 * 1. Access questionnaire data by language
 * 2. Use the new Redux actions for storing answers
 * 3. Configure new questionnaire steps
 */

import {
  getQuestionnaireStepsByLanguage,
  Onboarding_Questionnaires,
} from '../config/onboarding-questionnaires';
import { useOnboarding } from '../hooks/use-onboarding';

/**
 * Example: How to access questionnaire data
 */
export const exampleAccessQuestionnaireData = () => {
  // Get English questionnaire steps
  const englishSteps = getQuestionnaireStepsByLanguage('en');
  console.log('English questionnaire steps:', englishSteps);

  // Get French questionnaire steps
  const frenchSteps = getQuestionnaireStepsByLanguage('fr');
  console.log('French questionnaire steps:', frenchSteps);

  // Access specific questionnaire configuration
  const primaryUseCaseStep = Onboarding_Questionnaires.en.steps[0];
  console.log('Primary use case step:', primaryUseCaseStep);
};

/**
 * Example: How to use the new Redux actions in a component
 */
export const exampleUseInComponent = () => {
  const {
    setQuestionnaireAnswer,
    setQuestionnaireAnswerWithQuestion,
    setQuestionnaireResponse,
    questionnaireAnswers,
  } = useOnboarding();

  // Example 1: Simple answer storage (backward compatible)
  const handleSimpleAnswer = (stepId: string, answer: string) => {
    setQuestionnaireAnswer(stepId, answer);
  };

  // Example 2: Answer with question text (new enhanced method)
  const handleAnswerWithQuestion = (stepId: string, question: string, answer: string) => {
    setQuestionnaireAnswerWithQuestion(stepId, question, answer);
  };

  // Example 3: Bulk response storage
  const handleBulkResponse = () => {
    const response = {
      primary_use_case: {
        question: 'What is your primary use case for this app?',
        userAnswer: 'work',
        stepId: 'primary_use_case',
        timestamp: Date.now(),
      },
      interests: {
        question: 'What are your main interests?',
        userAnswer: ['technology', 'business'],
        stepId: 'interests',
        timestamp: Date.now(),
      },
    };
    setQuestionnaireResponse(response);
  };

  return {
    handleSimpleAnswer,
    handleAnswerWithQuestion,
    handleBulkResponse,
    questionnaireAnswers,
  };
};

/**
 * Example: How to add a new questionnaire step
 *
 * To add a new questionnaire step, simply modify the Onboarding_Questionnaires constant
 * in the config file. Here's an example of what you would add:
 */
export const exampleAddNewQuestionnaireStep = () => {
  // This is just an example - you would add this to the actual config file
  const newStepExample = {
    stepId: 'experience_level',
    stepTitle: 'What is your experience level with mobile apps?',
    stepOptions: [
      { id: 'beginner', label: 'Beginner', value: 'beginner' },
      { id: 'intermediate', label: 'Intermediate', value: 'intermediate' },
      { id: 'advanced', label: 'Advanced', value: 'advanced' },
      { id: 'expert', label: 'Expert', value: 'expert' },
    ],
    multiple: false,
    isSkippable: true,
  };

  // You would add this to both 'en' and 'fr' configurations
  console.log('Example new step:', newStepExample);
};

/**
 * Example: How to access stored answers
 */
export const exampleAccessStoredAnswers = () => {
  const { questionnaireAnswers, userPreferences } = useOnboarding();

  // Access specific answers
  const primaryUseCase = questionnaireAnswers.primary_use_case;
  const interests = questionnaireAnswers.interests as string[];

  // Access user preferences (automatically synced)
  const userPrimaryUseCase = userPreferences.primaryUseCase;
  const userInterests = userPreferences.interests;

  console.log('Stored answers:', {
    primaryUseCase,
    interests,
    userPrimaryUseCase,
    userInterests,
  });

  return {
    primaryUseCase,
    interests,
    userPrimaryUseCase,
    userInterests,
  };
};

/**
 * Example: How to validate questionnaire completion
 */
export const exampleValidateCompletion = () => {
  const { questionnaireAnswers } = useOnboarding();

  const requiredSteps = ['primary_use_case', 'app_usage_frequency'];
  const isComplete = requiredSteps.every(
    (stepId) =>
      questionnaireAnswers[stepId] &&
      (Array.isArray(questionnaireAnswers[stepId])
        ? (questionnaireAnswers[stepId] as string[]).length > 0
        : (questionnaireAnswers[stepId] as string).trim() !== '')
  );

  console.log('Questionnaire completion status:', isComplete);
  return isComplete;
};

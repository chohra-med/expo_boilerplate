import type React from 'react';
import { useCallback } from 'react';
import { Box, Button, Icon, SafeArea } from '#root/ui/components';
import { EnhancedQuestionnaire } from '../components/enhanced-questionnaire';
import { OnboardingStepComponent } from '../components/onboarding-step';
import { ProgressBar } from '../components/progress-bar';
import { onboardingData } from '../data/onboarding-data';
import { useOnboarding } from '../hooks/use-onboarding';
import { getQuestionnaireByLanguage } from '../utils/onboarding_constants';

export const OnboardingScreen: React.FC = () => {
  const {
    currentStep,
    totalSteps,
    progress,
    canGoNext,
    canGoPrevious,
    questionnaireAnswers,
    currentLanguage,
    next,
    previous,
    setQuestionnaireAnswer,
    setLanguage,
    complete,
  } = useOnboarding();

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  const handlePrevious = useCallback(() => {
    previous();
  }, [previous]);

  const handleSkip = useCallback(() => {
    // Skip to the end
    complete();
  }, [complete]);

  const handleQuestionnaireAnswer = useCallback(
    (stepId: string, answer: string | string[]) => {
      setQuestionnaireAnswer(stepId, answer);
    },
    [setQuestionnaireAnswer]
  );

  const handleLanguageChange = useCallback(
    (language: 'en' | 'fr') => {
      setLanguage(language);
    },
    [setLanguage]
  );

  const renderCurrentStep = () => {
    // First 3 steps are onboarding steps
    if (currentStep < 3) {
      const step = onboardingData.steps[currentStep];
      return (
        <OnboardingStepComponent
          step={step}
          onNext={handleNext}
          onSkip={handleSkip}
          canGoNext={canGoNext}
          isLastStep={currentStep === 2}
        />
      );
    }

    // Steps 3-6 are questionnaire steps
    if (currentStep >= 3 && currentStep < 7) {
      const questionnaireSteps = getQuestionnaireByLanguage(currentLanguage);
      const questionnaireIndex = currentStep - 3;
      const questionnaire = questionnaireSteps[questionnaireIndex];

      if (questionnaire) {
        const selectedAnswers =
          questionnaireAnswers[questionnaire.stepId] || (questionnaire.multiple ? [] : '');
        const isLastQuestionnaire = currentStep === 6;

        return (
          <EnhancedQuestionnaire
            questionnaire={questionnaire}
            selectedAnswers={selectedAnswers}
            onAnswer={(answer) => handleQuestionnaireAnswer(questionnaire.stepId, answer)}
            onNext={isLastQuestionnaire ? complete : handleNext}
            onSkip={handleSkip}
            isLastStep={isLastQuestionnaire}
          />
        );
      }
    }

    return null;
  };

  return (
    <SafeArea>
      <Box flex={1}>
        {/* Language Selector */}
        <Box flexDirection="row" justifyContent="flex-end" padding="md" gap="sm">
          <Button
            title="EN"
            onPress={() => handleLanguageChange('en')}
            buttonTypeVariant={currentLanguage === 'en' ? 'primary' : 'outline'}
            buttonSizeVariant="small"
          />
          <Button
            title="FR"
            onPress={() => handleLanguageChange('fr')}
            buttonTypeVariant={currentLanguage === 'fr' ? 'primary' : 'outline'}
            buttonSizeVariant="small"
          />
        </Box>

        {/* Progress Bar with Back Button */}
        <Box flexDirection="row" alignItems="center" paddingHorizontal="md" paddingVertical="sm">
          {canGoPrevious && (
            <Button
              title=""
              onPress={handlePrevious}
              buttonTypeVariant="ghost"
              buttonSizeVariant="small"
              leftIcon={<Icon name="arrow-back" size={20} />}
            />
          )}
          <Box flex={1} marginHorizontal="md">
            <ProgressBar progress={progress} totalSteps={totalSteps} currentStep={currentStep} />
          </Box>
        </Box>

        {renderCurrentStep()}
      </Box>
    </SafeArea>
  );
};

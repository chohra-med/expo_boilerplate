import type React from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, IconButton, SafeArea } from "#root/ui/components";
import { ConfigurableQuestionnaire } from "../components/configurable-questionnaire";
import { OnboardingStepComponent } from "../components/onboarding-step";
import { ProgressBar } from "../components/progress-bar";
import { getQuestionnaireStepsByLanguage } from "../config/onboarding-questionnaires";
import { onboardingData } from "../data/onboarding-data";
import { useOnboarding } from "../hooks/use-onboarding";

/**
 * Onboarding screen component
 * Guides users through app introduction and questionnaire
 * Supports multiple languages and step navigation
 */
export const OnboardingScreen: React.FC = () => {
  const { t } = useTranslation();
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

  /**
   * Handles next button press
   */
  const handleNext = useCallback(() => {
    next();
  }, [next]);

  /**
   * Handles previous button press
   */
  const handlePrevious = useCallback(() => {
    previous();
  }, [previous]);

  /**
   * Handles skip action - only allowed for onboarding steps, not questionnaire
   */
  const handleSkip = useCallback(() => {
    // Only allow skip for onboarding steps (first 3 steps), not questionnaire
    if (currentStep < 3) {
      complete();
    }
  }, [complete, currentStep]);

  /**
   * Handles questionnaire answer selection
   * @param stepId - The step identifier
   * @param answer - The selected answer(s)
   */
  const handleQuestionnaireAnswer = useCallback(
    (stepId: string, answer: string | string[]) => {
      setQuestionnaireAnswer(stepId, answer);
    },
    [setQuestionnaireAnswer]
  );

  /**
   * Handles language change
   * @param language - The selected language code
   */
  const handleLanguageChange = useCallback(
    (language: "en" | "fr") => {
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
          showSkip={true} // Always show skip for onboarding steps
        />
      );
    }

    // Steps 3-6 are questionnaire steps
    if (currentStep >= 3 && currentStep < 7) {
      const questionnaireSteps = getQuestionnaireStepsByLanguage(currentLanguage);
      const questionnaireIndex = currentStep - 3;
      const questionnaire = questionnaireSteps[questionnaireIndex];

      if (questionnaire) {
        const selectedAnswers =
          questionnaireAnswers[questionnaire.stepId] || (questionnaire.multiple ? [] : "");
        const isLastQuestionnaire = currentStep === 6;

        return (
          <ConfigurableQuestionnaire
            questionnaire={questionnaire}
            selectedAnswers={selectedAnswers}
            onAnswer={(answer) => handleQuestionnaireAnswer(questionnaire.stepId, answer)}
            onNext={isLastQuestionnaire ? complete : handleNext}
            onSkip={() => {}} // Disabled for questionnaire as a whole
            isLastStep={isLastQuestionnaire}
            showSkip={false} // Disable overall skip for questionnaire
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
            title={t("onboarding.buttons.english")}
            onPress={() => handleLanguageChange("en")}
            buttonTypeVariant={currentLanguage === "en" ? "primary" : "outline"}
            buttonSizeVariant="small"
          />
          <Button
            title={t("onboarding.buttons.french")}
            onPress={() => handleLanguageChange("fr")}
            buttonTypeVariant={currentLanguage === "fr" ? "primary" : "outline"}
            buttonSizeVariant="small"
          />
        </Box>

        {/* Progress Bar with Back Button */}
        <Box flexDirection="row" alignItems="center" paddingHorizontal="md" paddingVertical="sm">
          {canGoPrevious && (
            <IconButton
              iconName="arrow-back"
              onPress={handlePrevious}
              buttonTypeVariant="ghost"
              buttonSizeVariant="small"
              accessibilityLabel={t("common.back")}
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

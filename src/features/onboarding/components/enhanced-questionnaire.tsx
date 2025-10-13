import type React from "react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { Box, Button, Input, Text } from "#root/ui/components";
import type { QuestionnaireStep } from "../utils/onboarding_constants";

interface EnhancedQuestionnaireProps {
  questionnaire: QuestionnaireStep;
  selectedAnswers: string | string[];
  onAnswer: (answer: string | string[]) => void;
  onNext: () => void;
  onSkip: () => void;
  isLastStep: boolean;
}

export const EnhancedQuestionnaire: React.FC<EnhancedQuestionnaireProps> = ({
  questionnaire,
  selectedAnswers,
  onAnswer,
  onNext,
  onSkip,
  isLastStep,
}) => {
  const { t } = useTranslation();
  const [localAnswers, setLocalAnswers] = useState<string[]>(() => {
    if (questionnaire.multiple) {
      return Array.isArray(selectedAnswers) ? selectedAnswers : [];
    }
    return selectedAnswers ? [selectedAnswers as string] : [];
  });

  const [otherText, setOtherText] = useState<string>("");
  const [showOtherInput, setShowOtherInput] = useState<boolean>(false);

  const handleOptionSelect = useCallback(
    (optionValue: string) => {
      if (optionValue === "other") {
        setShowOtherInput(!showOtherInput);
        if (showOtherInput) {
          // Remove other from answers when hiding input
          const newAnswers = localAnswers.filter((answer) => answer !== "other");
          setLocalAnswers(newAnswers);
          onAnswer(newAnswers);
          setOtherText("");
        }
        return;
      }

      if (questionnaire.multiple) {
        const newAnswers = localAnswers.includes(optionValue)
          ? localAnswers.filter((answer) => answer !== optionValue)
          : [...localAnswers, optionValue];

        setLocalAnswers(newAnswers);
        onAnswer(newAnswers);
      } else {
        const newAnswer = localAnswers.includes(optionValue) ? "" : optionValue;
        setLocalAnswers(newAnswer ? [newAnswer] : []);
        onAnswer(newAnswer);
      }
    },
    [questionnaire.multiple, localAnswers, onAnswer, showOtherInput]
  );

  const handleOtherTextChange = useCallback(
    (text: string) => {
      setOtherText(text);
      if (text.trim()) {
        // Add other with custom text to answers
        const otherAnswers = localAnswers.filter((answer) => answer !== "other");
        const newAnswers = [...otherAnswers, `other:${text.trim()}`];
        setLocalAnswers(newAnswers);
        onAnswer(newAnswers);
      } else {
        // Remove other from answers if text is empty
        const newAnswers = localAnswers.filter(
          (answer) => answer !== "other" && !answer.startsWith("other:")
        );
        setLocalAnswers(newAnswers);
        onAnswer(newAnswers);
      }
    },
    [localAnswers, onAnswer]
  );

  const handleNext = useCallback(() => {
    if (questionnaire.multiple) {
      if (localAnswers.length > 0) {
        onNext();
      }
    } else {
      if (localAnswers.length > 0) {
        onNext();
      }
    }
  }, [questionnaire.multiple, localAnswers, onNext]);

  const canProceed = questionnaire.multiple ? localAnswers.length > 0 : localAnswers.length > 0;

  const isOptionSelected = useCallback(
    (optionValue: string) => {
      return localAnswers.includes(optionValue);
    },
    [localAnswers]
  );

  return (
    <Box flex={1} padding="md">
      <Box marginBottom="lg">
        <Text variant="h2" textAlign="center" marginBottom="sm">
          {questionnaire.stepTitle}
        </Text>
        {questionnaire.multiple && (
          <Text variant="bodySmall" textAlign="center" color="textSecondary" marginBottom="md">
            {t("onboarding.buttons.selectAll")}
          </Text>
        )}
      </Box>

      {/* Scrollable content area */}
      <Box flex={1} marginBottom="lg">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <Box gap="sm">
            {questionnaire.stepOptions.map((option) => (
              <Button
                key={option.id}
                title={option.label}
                onPress={() => handleOptionSelect(option.value)}
                buttonTypeVariant="selection"
                selected={
                  isOptionSelected(option.value) || (option.value === "other" && showOtherInput)
                }
                buttonSizeVariant="medium"
              />
            ))}
          </Box>

          {/* Other input field */}
          {questionnaire.hasOtherOption && showOtherInput && (
            <Box marginTop="md">
              <Input
                placeholder={
                  questionnaire.otherOptionPlaceholder || t("onboarding.buttons.pleaseSpecify")
                }
                value={otherText}
                onChangeText={handleOtherTextChange}
                multiline
                numberOfLines={2}
              />
            </Box>
          )}
        </ScrollView>
      </Box>

      {/* Fixed bottom buttons */}
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" paddingTop="md">
        {/* Skip button on the left */}
        <Box>
          {questionnaire.isSkippable && (
            <Button
              title={t("onboarding.buttons.skip")}
              onPress={onSkip}
              buttonTypeVariant="ghost"
              buttonSizeVariant="small"
            />
          )}
        </Box>

        {/* Next/Complete button on the right */}
        <Box>
          <Button
            title={isLastStep ? t("onboarding.buttons.done") : t("onboarding.buttons.next")}
            onPress={handleNext}
            disabled={!canProceed}
            buttonTypeVariant="primary"
            buttonSizeVariant="small"
          />
        </Box>
      </Box>
    </Box>
  );
};

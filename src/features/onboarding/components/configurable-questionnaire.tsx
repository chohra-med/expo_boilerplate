import type React from "react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, TextInput } from "react-native";
import { Box, Button, Text } from "#root/ui/components";
import type { QuestionnaireStep } from "../types";
import { configurableQuestionnaireStyles } from "./configurable-questionnaire.styles";

interface ConfigurableQuestionnaireProps {
  questionnaire: QuestionnaireStep;
  selectedAnswers?: string | string[];
  onAnswer: (answer: string | string[]) => void;
  onNext: () => void;
  onSkip: () => void;
  isLastStep: boolean;
  showSkip?: boolean;
}

export const ConfigurableQuestionnaire: React.FC<ConfigurableQuestionnaireProps> = ({
  questionnaire,
  selectedAnswers,
  onAnswer,
  onNext,
  onSkip,
  isLastStep,
  showSkip = true,
}) => {
  const { t } = useTranslation();
  const [otherText, setOtherText] = useState("");
  const [localAnswers, setLocalAnswers] = useState<string[]>(
    Array.isArray(selectedAnswers) ? selectedAnswers : selectedAnswers ? [selectedAnswers] : []
  );

  /**
   * Handles single answer selection
   */
  const handleSingleAnswer = useCallback(
    (value: string) => {
      const newAnswer = value === "other" ? otherText : value;
      setLocalAnswers([newAnswer]);
      onAnswer(newAnswer);
    },
    [onAnswer, otherText]
  );

  /**
   * Handles multiple answer selection/deselection
   */
  const handleMultipleAnswer = useCallback(
    (value: string) => {
      let newAnswers: string[];

      if (value === "other") {
        // Toggle other option
        if (localAnswers.includes("other")) {
          newAnswers = localAnswers.filter((answer) => answer !== "other");
        } else {
          newAnswers = [...localAnswers, "other"];
        }
      } else {
        // Toggle regular option
        if (localAnswers.includes(value)) {
          newAnswers = localAnswers.filter((answer) => answer !== value);
        } else {
          newAnswers = [...localAnswers, value];
        }
      }

      setLocalAnswers(newAnswers);
      onAnswer(newAnswers);
    },
    [localAnswers, onAnswer]
  );

  /**
   * Handles answer selection based on questionnaire type
   */
  const handleAnswer = useCallback(
    (value: string) => {
      if (questionnaire.multiple) {
        handleMultipleAnswer(value);
      } else {
        handleSingleAnswer(value);
      }
    },
    [questionnaire.multiple, handleMultipleAnswer, handleSingleAnswer]
  );

  /**
   * Handles next button press
   */
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
  }, [localAnswers, questionnaire.multiple, onNext]);

  /**
   * Handles other text input change
   */
  const handleOtherTextChange = useCallback(
    (text: string) => {
      setOtherText(text);

      if (questionnaire.multiple) {
        // Update the "other" answer with the text
        const otherAnswers = localAnswers.filter((answer) => answer !== "other");
        const newAnswers = text.trim() ? [...otherAnswers, text] : otherAnswers;
        setLocalAnswers(newAnswers);
        onAnswer(newAnswers);
      } else {
        // For single selection, update the answer directly
        if (localAnswers.includes("other")) {
          setLocalAnswers([text]);
          onAnswer(text);
        }
      }
    },
    [localAnswers, questionnaire.multiple, onAnswer]
  );

  const canProceed = questionnaire.multiple
    ? localAnswers.length > 0
    : localAnswers.length > 0 && localAnswers[0] !== "";

  const hasOtherSelected = localAnswers.includes("other");

  return (
    <Box flex={1} padding="md">
      <Box marginBottom="lg">
        <Text variant="h2" textAlign="center" marginBottom="sm">
          {questionnaire.stepTitle}
        </Text>
        {questionnaire.multiple && (
          <Text variant="h4" textAlign="center" color="textSecondary" marginBottom="md">
            {t("onboarding.buttons.selectAll")}
          </Text>
        )}
      </Box>

      <Box flex={1} marginBottom="lg">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={configurableQuestionnaireStyles.scrollViewContent}
        >
          <Box gap="sm">
            {questionnaire.stepOptions.map((option) => (
              <Button
                key={option.id}
                title={option.label}
                onPress={() => handleAnswer(option.value)}
                buttonTypeVariant={localAnswers.includes(option.value) ? "primary" : "outline"}
                buttonSizeVariant="medium"
              />
            ))}
          </Box>

          {/* Other option with text input */}
          {questionnaire.hasOtherOption && hasOtherSelected && (
            <Box marginTop="md">
              <Text variant="body" marginBottom="sm" color="textSecondary">
                {questionnaire.otherOptionPlaceholder || t("onboarding.buttons.pleaseSpecify")}
              </Text>
              <TextInput
                value={otherText}
                onChangeText={handleOtherTextChange}
                placeholder={
                  questionnaire.otherOptionPlaceholder || t("onboarding.buttons.pleaseSpecify")
                }
                style={configurableQuestionnaireStyles.textInput}
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
          {questionnaire.isSkippable && showSkip && (
            <Button
              title={t("onboarding.buttons.skip")}
              onPress={onSkip}
              buttonTypeVariant="ghost"
              buttonSizeVariant="small"
            />
          )}
        </Box>

        {/* Next/Done button on the right */}
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

import type React from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { Box, Button, Text } from "#root/ui/components";
import type { Questionnaire } from "../types";

interface QuestionnaireProps {
  questionnaire: Questionnaire;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const QuestionnaireComponent: React.FC<QuestionnaireProps> = ({
  questionnaire,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
}) => {
  const { t } = useTranslation();

  /**
   * Handles answer selection
   * @param answer - The selected answer value
   */
  const handleAnswer = useCallback(
    (answer: string) => {
      onAnswer(answer);
    },
    [onAnswer]
  );

  /**
   * Handles next button press
   * Only proceeds if an answer is selected
   */
  const handleNext = useCallback(() => {
    if (selectedAnswer) {
      onNext();
    }
  }, [selectedAnswer, onNext]);

  return (
    <Box flex={1} padding="md">
      <Box marginBottom="lg">
        <Text variant="h2" textAlign="center" marginBottom="sm">
          {t(questionnaire.title)}
        </Text>
        <Text variant="h4" textAlign="center" color="textSecondary">
          {t(questionnaire.question)}
        </Text>
      </Box>

      <Box flex={1} marginBottom="lg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box gap="sm">
            {questionnaire.options.map((option) => (
              <Button
                key={option.id}
                title={t(option.label)}
                onPress={() => handleAnswer(option.value)}
                buttonTypeVariant={
                  selectedAnswer === option.value ? "primary" : "outline"
                }
                buttonSizeVariant="medium"
              />
            ))}
          </Box>
        </ScrollView>
      </Box>

      {/* Fixed bottom buttons */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingTop="md"
      >
        {/* Skip button on the left */}
        <Box>
          <Button
            title={t("onboarding.buttons.skip")}
            onPress={onPrevious}
            buttonTypeVariant="ghost"
            buttonSizeVariant="small"
          />
        </Box>

        {/* Next button on the right */}
        <Box>
          <Button
            title={t("onboarding.buttons.next")}
            onPress={handleNext}
            disabled={!selectedAnswer}
            buttonTypeVariant="primary"
            buttonSizeVariant="small"
          />
        </Box>
      </Box>
    </Box>
  );
};

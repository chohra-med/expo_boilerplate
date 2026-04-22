import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, ScrollView } from "react-native";
import { getQuestionnaireStepsByLanguage } from "#root/features/onboarding/config/onboarding-questionnaires";
import { useOnboarding } from "#root/features/onboarding/hooks/use-onboarding";
import { Box, Button, Icon, IconButton, SafeArea, Text } from "#root/ui/components";
import { animationConfig, layoutConstants, profileStyles } from "../constants/profile-styles";

interface QuestionnaireDetailViewProps {
  onBack: () => void;
  onEdit?: () => void;
}

export const QuestionnaireDetailView: React.FC<QuestionnaireDetailViewProps> = ({
  onBack,
  onEdit,
}) => {
  const { t } = useTranslation();
  const { questionnaireAnswers, currentLanguage } = useOnboarding();

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  // Animate on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, animationConfig.fadeIn),
      Animated.timing(slideAnim, animationConfig.slideUp),
    ]).start();
  }, [fadeAnim, slideAnim]);

  /**
   * Get questionnaire step by stepId
   */
  const getQuestionnaireStep = useCallback(
    (stepId: string) => {
      const steps = getQuestionnaireStepsByLanguage(currentLanguage);
      return steps.find((step) => step.stepId === stepId);
    },
    [currentLanguage]
  );

  /**
   * Format answer for display
   */
  const formatAnswer = useCallback((answer: string | string[]) => {
    if (Array.isArray(answer)) {
      return answer.join(", ");
    }
    return answer;
  }, []);

  /**
   * Get answer label for display
   */
  const getAnswerLabel = useCallback(
    (stepId: string, answer: string | string[]) => {
      const step = getQuestionnaireStep(stepId);
      if (!step) return formatAnswer(answer);

      if (Array.isArray(answer)) {
        return answer
          .map((ans) => {
            const option = step.stepOptions.find((opt) => opt.value === ans);
            return option ? option.label : ans;
          })
          .join(", ");
      } else {
        const option = step.stepOptions.find((opt) => opt.value === answer);
        return option ? option.label : answer;
      }
    },
    [getQuestionnaireStep, formatAnswer]
  );

  /**
   * Render questionnaire answer item with enhanced styling
   */
  const renderQuestionnaireItem = useCallback(
    (stepId: string, answer: string | string[], index: number) => {
      const step = getQuestionnaireStep(stepId);
      if (!step) return null;

      const isMultiple = Array.isArray(answer);
      const answerCount = isMultiple ? answer.length : 1;

      return (
        <Animated.View
          key={stepId}
          style={{
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          }}
        >
          <Box
            backgroundColor="backgroundSecondary"
            padding="lg"
            borderRadius="lg"
            marginBottom="md"
            style={profileStyles.shadowCardLarge}
          >
            {/* Question Header */}
            <Box flexDirection="row" alignItems="center" marginBottom="md">
              <Box
                width={layoutConstants.questionNumberSize}
                height={layoutConstants.questionNumberSize}
                borderRadius="full"
                backgroundColor="primary"
                alignItems="center"
                justifyContent="center"
                marginRight="md"
              >
                <Text variant="h6" color="white" fontWeight="bold">
                  {index + 1}
                </Text>
              </Box>
              <Box flex={1}>
                <Text variant="h5" color="primary">
                  {step.stepTitle}
                </Text>
                <Box flexDirection="row" alignItems="center" marginTop="xs">
                  <Icon
                    name={isMultiple ? "checkmark-circle" : "radio-button-on"}
                    size={14}
                    color="primary"
                  />
                  <Text variant="bodySmall" color="primary" marginLeft="xs">
                    {isMultiple
                      ? `${answerCount} ${t("settings.profile.selected")}`
                      : t("settings.profile.singleChoice")}
                  </Text>
                </Box>
              </Box>
            </Box>

            {/* Answer Content */}
            <Box
              backgroundColor="background"
              padding="md"
              borderRadius="md"
              borderLeftWidth={4}
              borderLeftColor="primary"
            >
              <Text variant="body" color="textSecondary" marginBottom="xs">
                {t("settings.profile.yourAnswer")}:
              </Text>
              <Text variant="h6" color="primary">
                {getAnswerLabel(stepId, answer)}
              </Text>
            </Box>

            {/* Answer Details */}
            {isMultiple && answer.length > 1 && (
              <Box marginTop="md">
                <Text variant="bodySmall" color="textSecondary" marginBottom="sm">
                  {t("settings.profile.selectedOptions")}:
                </Text>
                <Box flexDirection="row" flexWrap="wrap" gap="xs">
                  {answer.map((ans, _idx) => {
                    const option = step.stepOptions.find((opt) => opt.value === ans);
                    return (
                      <Box
                        key={ans}
                        backgroundColor="primary"
                        paddingHorizontal="sm"
                        paddingVertical="xs"
                        borderRadius="sm"
                      >
                        <Text variant="bodySmall" color="white">
                          {option ? option.label : ans}
                        </Text>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
        </Animated.View>
      );
    },
    [fadeAnim, slideAnim, getQuestionnaireStep, getAnswerLabel, t]
  );

  const questionnaireEntries = Object.entries(questionnaireAnswers);

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box flex={1} padding="lg">
          {/* Header */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginBottom="xl"
            >
              <Box flexDirection="row" alignItems="center">
                <IconButton
                  iconName="arrow-back"
                  onPress={onBack}
                  buttonTypeVariant="ghost"
                  buttonSizeVariant="small"
                  accessibilityLabel={t("common.back")}
                />
                <Text variant="h2" marginLeft="sm">
                  {t("settings.profile.questionnaireDetails")}
                </Text>
              </Box>
            </Box>
          </Animated.View>

          {/* Content */}
          {questionnaireEntries.length > 0 ? (
            <Box>
              {/* Summary Card */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <Box
                  backgroundColor="primary"
                  padding="lg"
                  borderRadius="lg"
                  marginBottom="lg"
                  style={profileStyles.shadowSummary}
                >
                  <Box flexDirection="row" alignItems="center" marginBottom="sm">
                    <Icon
                      name="checkmark-circle"
                      size={layoutConstants.iconSize.medium}
                      color="white"
                    />
                    <Text variant="h4" color="white" marginLeft="sm">
                      {t("settings.profile.questionnaireComplete")}
                    </Text>
                  </Box>
                  <Text variant="body" color="white" opacity={0.9}>
                    {t("settings.profile.questionnaireCompleteDescription", {
                      count: questionnaireEntries.length,
                    })}
                  </Text>
                </Box>
              </Animated.View>

              {/* Individual Answers */}
              {questionnaireEntries.map(([stepId, answer], index) =>
                renderQuestionnaireItem(stepId, answer, index)
              )}
            </Box>
          ) : (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Box
                backgroundColor="backgroundSecondary"
                padding="xl"
                borderRadius="lg"
                alignItems="center"
                style={profileStyles.shadowEmpty}
              >
                <Icon
                  name="help-circle"
                  size={layoutConstants.iconSize.xlarge}
                  color="textSecondary"
                />
                <Text variant="h4" textAlign="center" marginTop="lg" marginBottom="md">
                  {t("settings.profile.noQuestionnaireDetails")}
                </Text>
                <Text variant="body" color="textSecondary" textAlign="center" marginBottom="lg">
                  {t("settings.profile.noQuestionnaireDetailsDescription")}
                </Text>
                <Button
                  title={t("settings.profile.completeQuestionnaire")}
                  onPress={onEdit || (() => {})}
                  buttonTypeVariant="primary"
                />
              </Box>
            </Animated.View>
          )}
        </Box>
      </ScrollView>
    </SafeArea>
  );
};

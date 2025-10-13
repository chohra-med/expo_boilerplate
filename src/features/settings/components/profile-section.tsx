import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Image, Pressable, ScrollView } from "react-native";
import { useAuth } from "#root/features/auth/hooks/use-auth";
import { getQuestionnaireStepsByLanguage } from "#root/features/onboarding/config/onboarding-questionnaires";
import { useOnboarding } from "#root/features/onboarding/hooks/use-onboarding";
import { Box, Button, Icon, SafeArea, Text } from "#root/ui/components";
import { animationConfig, layoutConstants, profileStyles } from "../constants/profile-styles";

interface ProfileSectionProps {
  onEditProfile?: () => void;
  onViewQuestionnaire?: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  onEditProfile,
  onViewQuestionnaire,
}) => {
  const { t } = useTranslation();
  const { questionnaireAnswers, userPreferences, currentLanguage } = useOnboarding();
  const { user } = useAuth();

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  // Animate on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, animationConfig.fadeIn),
      Animated.timing(slideAnim, animationConfig.slideUp),
      Animated.spring(scaleAnim, animationConfig.spring),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

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
   * Render questionnaire answer item
   */
  const renderQuestionnaireItem = useCallback(
    (stepId: string, answer: string | string[]) => {
      const step = getQuestionnaireStep(stepId);
      if (!step) return null;

      return (
        <Animated.View
          key={stepId}
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Box
            backgroundColor="backgroundSecondary"
            padding="md"
            borderRadius="md"
            marginBottom="sm"
            style={profileStyles.shadowCard}
          >
            <Text variant="h5" marginBottom="xs" color="primary">
              {step.stepTitle}
            </Text>
            <Text variant="body" color="textSecondary">
              {getAnswerLabel(stepId, answer)}
            </Text>
          </Box>
        </Animated.View>
      );
    },
    [fadeAnim, slideAnim, getQuestionnaireStep, getAnswerLabel]
  );

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Box flex={1} padding="lg">
            {/* Header */}
            <Box alignItems="center" marginBottom="xl">
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                }}
              >
                <Box
                  width={layoutConstants.avatarSize}
                  height={layoutConstants.avatarSize}
                  borderRadius="full"
                  backgroundColor="primary"
                  alignItems="center"
                  justifyContent="center"
                  marginBottom="md"
                  style={profileStyles.shadowAvatar}
                >
                  {user?.avatar ? (
                    <Image source={{ uri: user.avatar }} style={profileStyles.avatarImage} />
                  ) : (
                    <Icon name="person" size={layoutConstants.iconSize.large} color="white" />
                  )}
                </Box>
              </Animated.View>

              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <Text variant="h2" textAlign="center" marginBottom="xs">
                  {user?.name || t("common.loading")}
                </Text>
                <Text variant="body" color="textSecondary" textAlign="center" marginBottom="lg">
                  {user?.email || ""}
                </Text>

                <Button
                  title={t("settings.profile.editProfile")}
                  onPress={onEditProfile || (() => {})}
                  buttonTypeVariant="outline"
                  buttonSizeVariant="small"
                  leftIcon={
                    <Icon name="pencil" size={layoutConstants.iconSize.small} color="primary" />
                  }
                />
              </Animated.View>
            </Box>

            {/* Questionnaire Answers Section */}
            <Box marginBottom="xl">
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginBottom="lg"
              >
                <Text variant="h3">{t("settings.profile.title")}</Text>
                <Pressable onPress={onViewQuestionnaire || (() => {})}>
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    padding="sm"
                    borderRadius="sm"
                    backgroundColor="backgroundSecondary"
                  >
                    <Icon name="eye" size={layoutConstants.iconSize.small} color="primary" />
                    <Text variant="bodySmall" color="primary" marginLeft="xs">
                      {t("settings.profile.viewProfile")}
                    </Text>
                  </Box>
                </Pressable>
              </Box>

              {/* Questionnaire Answers */}
              {Object.keys(questionnaireAnswers).length > 0 ? (
                <Box>
                  {Object.entries(questionnaireAnswers).map(([stepId, answer]) =>
                    renderQuestionnaireItem(stepId, answer)
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
                    borderRadius="md"
                    alignItems="center"
                    style={profileStyles.shadowEmpty}
                  >
                    <Icon
                      name="help-circle"
                      size={layoutConstants.iconSize.large}
                      color="textSecondary"
                    />
                    <Text variant="h5" textAlign="center" marginTop="md" marginBottom="sm">
                      {t("settings.profile.noQuestionnaireData")}
                    </Text>
                    <Text variant="body" color="textSecondary" textAlign="center" marginBottom="lg">
                      {t("settings.profile.noQuestionnaireDescription")}
                    </Text>
                    <Button
                      title={t("settings.profile.completeQuestionnaire")}
                      onPress={onViewQuestionnaire || (() => {})}
                      buttonTypeVariant="primary"
                      buttonSizeVariant="small"
                    />
                  </Box>
                </Animated.View>
              )}
            </Box>

            {/* User Preferences Summary */}
            {Object.keys(userPreferences).length > 0 && (
              <Box marginBottom="xl">
                <Text variant="h4" marginBottom="md">
                  {t("settings.profile.preferencesSummary")}
                </Text>
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  }}
                >
                  <Box
                    backgroundColor="backgroundSecondary"
                    padding="md"
                    borderRadius="md"
                    style={profileStyles.shadowCard}
                  >
                    {userPreferences.primaryUseCase && (
                      <Box flexDirection="row" alignItems="center" marginBottom="sm">
                        <Icon
                          name="briefcase"
                          size={layoutConstants.iconSize.small}
                          color="primary"
                        />
                        <Text variant="body" marginLeft="sm">
                          {t("settings.profile.primaryUse")}: {userPreferences.primaryUseCase}
                        </Text>
                      </Box>
                    )}
                    {userPreferences.appUsageFrequency && (
                      <Box flexDirection="row" alignItems="center" marginBottom="sm">
                        <Icon name="time" size={layoutConstants.iconSize.small} color="primary" />
                        <Text variant="body" marginLeft="sm">
                          {t("settings.profile.usage")}: {userPreferences.appUsageFrequency}
                        </Text>
                      </Box>
                    )}
                    {userPreferences.interests && userPreferences.interests.length > 0 && (
                      <Box flexDirection="row" alignItems="flex-start" marginBottom="sm">
                        <Box marginTop="xs">
                          <Icon
                            name="heart"
                            size={layoutConstants.iconSize.small}
                            color="primary"
                          />
                        </Box>
                        <Box flex={1} marginLeft="sm">
                          <Text variant="body" marginBottom="xs">
                            {t("settings.profile.interests")}:
                          </Text>
                          <Text variant="bodySmall" color="textSecondary">
                            {userPreferences.interests.join(", ")}
                          </Text>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Animated.View>
              </Box>
            )}
          </Box>
        </Animated.View>
      </ScrollView>
    </SafeArea>
  );
};

import type React from "react";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { QuestionnaireDetailView } from "#root/features/settings/components/questionnaire-detail-view";

/**
 * Questionnaire screen component
 * Displays detailed questionnaire responses
 */
export const QuestionnaireScreen: React.FC = () => {
  const navigation = useNavigation();

  /**
   * Handles back navigation
   */
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  /**
   * Handles questionnaire edit action
   */
  const handleEditQuestionnaire = useCallback(() => {
    // In a real app, this would navigate to questionnaire edit or restart onboarding
    console.log("Edit questionnaire");
  }, []);

  return (
    <QuestionnaireDetailView
      onBack={handleBack}
      onEdit={handleEditQuestionnaire}
    />
  );
};

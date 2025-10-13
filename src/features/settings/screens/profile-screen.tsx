import { useNavigation } from "@react-navigation/native";
import type React from "react";
import { useCallback } from "react";
import { ProfileSection } from "#root/features/settings/components/profile-section";

/**
 * Profile screen component
 * Displays user profile information and questionnaire responses
 */
export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  /**
   * Handles profile edit action
   */
  const handleEditProfile = useCallback(() => {
    // In a real app, this would navigate to profile edit screen
    console.log("Edit profile");
  }, []);

  /**
   * Handles questionnaire view action
   */
  const handleViewQuestionnaire = useCallback(() => {
    navigation.navigate("Questionnaire" as never);
  }, [navigation]);

  return (
    <ProfileSection
      onEditProfile={handleEditProfile}
      onViewQuestionnaire={handleViewQuestionnaire}
    />
  );
};

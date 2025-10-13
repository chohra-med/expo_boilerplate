import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type React from "react";
import { useCallback } from "react";
import { ProfileSection } from "#root/features/settings/components/profile-section";
import type { SettingsStackParamList } from "#root/navigation/routes";

// Navigation type for profile screen
type ProfileScreenNavigationProp = StackNavigationProp<SettingsStackParamList, "Profile">;

/**
 * Profile screen component
 * Displays user profile information and questionnaire responses
 */
export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

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
    navigation.navigate("Questionnaire");
  }, [navigation]);

  return (
    <ProfileSection
      onEditProfile={handleEditProfile}
      onViewQuestionnaire={handleViewQuestionnaire}
    />
  );
};

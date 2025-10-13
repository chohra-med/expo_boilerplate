import type React from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Box, Button, Icon, SafeArea, Text } from "#root/ui/components";
import { SelectionButton } from "#root/features/settings/components/selection-button";
import { useSettings } from "../hooks/use-settings";

/**
 * Main settings screen component for managing app preferences
 * Includes theme selection, language settings, and logout functionality
 */
export const MainSettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { themeMode, language, setThemeMode, setLanguage, handleLogout } =
    useSettings();

  /**
   * Handles theme selection
   * @param value - The selected theme value
   */
  const handleThemeSelect = useCallback(
    (value: string) => {
      setThemeMode(value as "light" | "dark" | "system");
    },
    [setThemeMode]
  );

  /**
   * Handles language selection
   * @param value - The selected language value
   */
  const handleLanguageSelect = useCallback(
    (value: string) => {
      setLanguage(value as "en" | "fr");
    },
    [setLanguage]
  );

  /**
   * Navigate to profile screen
   */
  const handleNavigateToProfile = useCallback(() => {
    navigation.navigate("Profile" as never);
  }, [navigation]);

  return (
    <SafeArea>
      <ScrollView>
        <Box flex={1} padding="lg">
          <Box marginBottom="xl">
            <Text variant="h1" marginBottom="sm">
              {t("settings.title")}
            </Text>
            <Text variant="body" color="textSecondary">
              {t("settings.subtitle")}
            </Text>
          </Box>

          <Box gap="lg">
            {/* Profile Section */}
            <Box
              backgroundColor="backgroundSecondary"
              padding="lg"
              borderRadius="md"
            >
              <Text variant="h4" marginBottom="md">
                {t("settings.profile.title")}
              </Text>
              <Text variant="bodySmall" color="textSecondary" marginBottom="md">
                {t("settings.profile.subtitle")}
              </Text>
              <Button
                title={t("settings.profile.viewProfile")}
                onPress={handleNavigateToProfile}
                buttonTypeVariant="outline"
                leftIcon={<Icon name="person" size={16} color="primary" />}
              />
            </Box>

            {/* Theme Settings */}
            <Box
              backgroundColor="backgroundSecondary"
              padding="lg"
              borderRadius="md"
            >
              <Text variant="h4" marginBottom="md">
                {t("settings.theme.title")}
              </Text>
              <Text variant="bodySmall" color="textSecondary" marginBottom="md">
                {t("settings.theme.description")}
              </Text>

              <Box flexDirection="row" gap="sm">
                <SelectionButton
                  iconName="sunny"
                  label={t("settings.theme.light")}
                  isSelected={themeMode === "light"}
                  onPress={() => handleThemeSelect("light")}
                />
                <SelectionButton
                  iconName="moon"
                  label={t("settings.theme.dark")}
                  isSelected={themeMode === "dark"}
                  onPress={() => handleThemeSelect("dark")}
                />
                <SelectionButton
                  iconName="settings"
                  label={t("settings.theme.system")}
                  isSelected={themeMode === "system"}
                  onPress={() => handleThemeSelect("system")}
                />
              </Box>
            </Box>

            {/* Language Settings */}
            <Box
              backgroundColor="backgroundSecondary"
              padding="lg"
              borderRadius="md"
            >
              <Text variant="h4" marginBottom="md">
                {t("settings.language.title")}
              </Text>
              <Text variant="bodySmall" color="textSecondary" marginBottom="md">
                {t("settings.language.description")}
              </Text>

              <Box flexDirection="row" gap="sm">
                <SelectionButton
                  iconName="language"
                  label={t("settings.language.english")}
                  isSelected={language === "en"}
                  onPress={() => handleLanguageSelect("en")}
                />
                <SelectionButton
                  iconName="language"
                  label={t("settings.language.french")}
                  isSelected={language === "fr"}
                  onPress={() => handleLanguageSelect("fr")}
                />
              </Box>
            </Box>

            {/* Logout */}
            <Box
              backgroundColor="backgroundSecondary"
              padding="lg"
              borderRadius="md"
            >
              <Button
                title={t("settings.logout")}
                onPress={handleLogout}
                buttonTypeVariant="outline"
              />
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </SafeArea>
  );
};

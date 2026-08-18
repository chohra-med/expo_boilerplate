import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type React from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { SelectionButton } from "#root/features/settings/components/selection-button";
import { WireDemoOnboarding } from "#root/features/wire";
import type { SettingsStackParamList } from "#root/navigation/routes";
import { Box, Button, Icon, SafeArea, Text } from "#root/ui/components";
import { useSettings } from "../hooks/use-settings";

// Navigation type for main settings screen
type MainSettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, "MainSettings">;

/**
 * Main settings screen component for managing app preferences
 * Includes theme selection, language settings, and logout functionality
 */
export const MainSettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<MainSettingsScreenNavigationProp>();
  const { themeMode, language, setThemeMode, setLanguage, handleLogout } = useSettings();

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
    navigation.navigate("Profile");
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
            <Box backgroundColor="backgroundSecondary" padding="lg" borderRadius="md">
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
            <Box backgroundColor="backgroundSecondary" padding="lg" borderRadius="md">
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
            <Box backgroundColor="backgroundSecondary" padding="lg" borderRadius="md">
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
            <Box backgroundColor="backgroundSecondary" padding="lg" borderRadius="md">
              <Button
                title={t("settings.logout")}
                onPress={handleLogout}
                buttonTypeVariant="outline"
              />
            </Box>

            {/*
              DEV-ONLY: re-run the real Wire AI onboarding flow on demand (no account, no
              navigation side effects) to QA a change to the once-per-user funnel. The guard is
              `__DEV__`, not an env var — `EXPO_PUBLIC_*` inlines at build time and would ship ON.
              The component also self-guards, so it renders nothing in a production build.
            */}
            {__DEV__ ? (
              <Box backgroundColor="backgroundSecondary" padding="lg" borderRadius="md">
                <WireDemoOnboarding />
              </Box>
            ) : null}
          </Box>
        </Box>
      </ScrollView>
    </SafeArea>
  );
};

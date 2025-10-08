import type React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Box, Button, Icon, SafeArea, Text } from '#root/ui/components';
import { useSettings } from '../hooks/use-settings';

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode, language, setThemeMode, setLanguage, handleLogout } = useSettings();

  const handleThemeSelect = useCallback(
    (value: string) => {
      setThemeMode(value as 'light' | 'dark' | 'system');
    },
    [setThemeMode]
  );

  const handleLanguageSelect = useCallback(
    (value: string) => {
      setLanguage(value as 'en' | 'fr');
    },
    [setLanguage]
  );

  return (
    <SafeArea variant="all" backgroundColor="background">
      <ScrollView>
        <Box flex={1} padding="lg">
          <Box marginBottom="xl">
            <Text variant="h1" marginBottom="sm">
              {t('settings.title')}
            </Text>
            <Text variant="body" color="textSecondary">
              Customize your experience
            </Text>
          </Box>

          <Box gap="lg">
            {/* Theme Settings */}
            <Box backgroundColor="backgroundSecondary" padding="lg" borderRadius="md">
              <Text variant="h4" marginBottom="md">
                {t('settings.theme.title')}
              </Text>
              <Text variant="bodySmall" color="textSecondary" marginBottom="md">
                {t('settings.theme.description')}
              </Text>

              <Box flexDirection="row" gap="sm">
                {/* Light Theme Button */}
                <Box flex={1}>
                  <TouchableOpacity onPress={() => handleThemeSelect('light')} activeOpacity={0.7}>
                    <Box
                      alignItems="center"
                      padding="md"
                      backgroundColor={themeMode === 'light' ? 'primaryBackground' : 'background'}
                      borderRadius="md"
                      borderWidth={themeMode === 'light' ? 2 : 1}
                      borderColor={themeMode === 'light' ? 'primary' : 'border'}
                    >
                      <Icon
                        name="sunny"
                        size={24}
                        color={themeMode === 'light' ? 'primary' : 'textSecondary'}
                      />
                      <Text
                        variant="caption"
                        marginTop="xs"
                        color={themeMode === 'light' ? 'primary' : 'textSecondary'}
                        textAlign="center"
                      >
                        {t('settings.theme.light')}
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </Box>

                {/* Dark Theme Button */}
                <Box flex={1}>
                  <TouchableOpacity onPress={() => handleThemeSelect('dark')} activeOpacity={0.7}>
                    <Box
                      alignItems="center"
                      padding="md"
                      backgroundColor={themeMode === 'dark' ? 'primaryBackground' : 'background'}
                      borderRadius="md"
                      borderWidth={themeMode === 'dark' ? 2 : 1}
                      borderColor={themeMode === 'dark' ? 'primary' : 'border'}
                    >
                      <Icon
                        name="moon"
                        size={24}
                        color={themeMode === 'dark' ? 'primary' : 'textSecondary'}
                      />
                      <Text
                        variant="caption"
                        marginTop="xs"
                        color={themeMode === 'dark' ? 'primary' : 'textSecondary'}
                        textAlign="center"
                      >
                        {t('settings.theme.dark')}
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </Box>

                {/* System Theme Button */}
                <Box flex={1}>
                  <TouchableOpacity onPress={() => handleThemeSelect('system')} activeOpacity={0.7}>
                    <Box
                      alignItems="center"
                      padding="md"
                      backgroundColor={themeMode === 'system' ? 'primaryBackground' : 'background'}
                      borderRadius="md"
                      borderWidth={themeMode === 'system' ? 2 : 1}
                      borderColor={themeMode === 'system' ? 'primary' : 'border'}
                    >
                      <Icon
                        name="settings"
                        size={24}
                        color={themeMode === 'system' ? 'primary' : 'textSecondary'}
                      />
                      <Text
                        variant="caption"
                        marginTop="xs"
                        color={themeMode === 'system' ? 'primary' : 'textSecondary'}
                        textAlign="center"
                      >
                        {t('settings.theme.system')}
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
            </Box>

            {/* Language Settings */}
            <Box backgroundColor="backgroundSecondary" padding="lg" borderRadius="md">
              <Text variant="h4" marginBottom="md">
                {t('settings.language.title')}
              </Text>
              <Text variant="bodySmall" color="textSecondary" marginBottom="md">
                {t('settings.language.description')}
              </Text>

              <Box flexDirection="row" gap="sm">
                {/* English Language Button */}
                <Box flex={1}>
                  <TouchableOpacity onPress={() => handleLanguageSelect('en')} activeOpacity={0.7}>
                    <Box
                      alignItems="center"
                      padding="md"
                      backgroundColor={language === 'en' ? 'primaryBackground' : 'background'}
                      borderRadius="md"
                      borderWidth={language === 'en' ? 2 : 1}
                      borderColor={language === 'en' ? 'primary' : 'border'}
                    >
                      <Icon
                        name="language"
                        size={24}
                        color={language === 'en' ? 'primary' : 'textSecondary'}
                      />
                      <Text
                        variant="caption"
                        marginTop="xs"
                        color={language === 'en' ? 'primary' : 'textSecondary'}
                        textAlign="center"
                      >
                        {t('settings.language.english')}
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </Box>

                {/* French Language Button */}
                <Box flex={1}>
                  <TouchableOpacity onPress={() => handleLanguageSelect('fr')} activeOpacity={0.7}>
                    <Box
                      alignItems="center"
                      padding="md"
                      backgroundColor={language === 'fr' ? 'primaryBackground' : 'background'}
                      borderRadius="md"
                      borderWidth={language === 'fr' ? 2 : 1}
                      borderColor={language === 'fr' ? 'primary' : 'border'}
                    >
                      <Icon
                        name="language"
                        size={24}
                        color={language === 'fr' ? 'primary' : 'textSecondary'}
                      />
                      <Text
                        variant="caption"
                        marginTop="xs"
                        color={language === 'fr' ? 'primary' : 'textSecondary'}
                        textAlign="center"
                      >
                        {t('settings.language.french')}
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
            </Box>

            {/* Logout */}
            <Box backgroundColor="backgroundSecondary" padding="lg" borderRadius="md">
              <Button
                title={t('settings.logout')}
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

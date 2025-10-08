import type React from 'react';
import { Box, Button, Text } from '#root/ui/components';
import type { OnboardingStep } from '../types';

interface OnboardingStepProps {
  step: OnboardingStep;
  onNext: () => void;
  onSkip: () => void;
  canGoNext: boolean;
  isLastStep: boolean;
}

export const OnboardingStepComponent: React.FC<OnboardingStepProps> = ({
  step,
  onNext,
  onSkip,
  canGoNext,
  isLastStep,
}) => {
  // Simple translation function for now
  const t = (key: string): string => {
    const translations: Record<string, string> = {
      'onboarding.welcome.title': 'Welcome to MobileLauncher',
      'onboarding.welcome.subtitle': 'Your personal mobile companion',
      'onboarding.welcome.description': 'Discover amazing features and customize your experience',
      'onboarding.features.title': 'Powerful Features',
      'onboarding.features.subtitle': 'Everything you need in one place',
      'onboarding.features.description': 'Easily access all your favorite apps and tools',
      'onboarding.customization.title': 'Customize Your Experience',
      'onboarding.customization.subtitle': 'Make it truly yours',
      'onboarding.customization.description':
        'Customize themes, layouts, and preferences to match your style',
      'onboarding.buttons.skip': 'Skip',
      'onboarding.buttons.next': 'Next',
      'onboarding.buttons.done': 'Done',
    };
    return translations[key] || key;
  };

  return (
    <Box flex={1} padding="md">
      <Box flex={1} marginBottom="lg">
        <Box alignItems="center" justifyContent="center" flex={1}>
          <Text variant="h2" textAlign="center" marginBottom="sm">
            {t(step.title)}
          </Text>
          <Text variant="h4" textAlign="center" marginBottom="md" color="textSecondary">
            {t(step.subtitle)}
          </Text>
          <Text variant="body" textAlign="center" color="textSecondary">
            {t(step.description)}
          </Text>
        </Box>
      </Box>

      {/* Fixed bottom buttons */}
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" paddingTop="md">
        {/* Skip button on the left */}
        <Box>
          {!isLastStep && (
            <Button
              title={t('onboarding.buttons.skip')}
              onPress={onSkip}
              buttonTypeVariant="ghost"
              buttonSizeVariant="small"
            />
          )}
        </Box>

        {/* Next/Done button on the right */}
        <Box>
          {canGoNext && (
            <Button
              title={t('onboarding.buttons.next')}
              onPress={onNext}
              buttonTypeVariant="primary"
              buttonSizeVariant="small"
            />
          )}

          {isLastStep && (
            <Button
              title={t('onboarding.buttons.done')}
              onPress={onNext}
              buttonTypeVariant="primary"
              buttonSizeVariant="small"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

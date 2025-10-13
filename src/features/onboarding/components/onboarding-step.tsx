import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Text } from '#root/ui/components';
import type { OnboardingStep } from '../types';

interface OnboardingStepProps {
  step: OnboardingStep;
  onNext: () => void;
  onSkip: () => void;
  canGoNext: boolean;
  isLastStep: boolean;
  showSkip?: boolean;
}

export const OnboardingStepComponent: React.FC<OnboardingStepProps> = ({
  step,
  onNext,
  onSkip,
  canGoNext,
  isLastStep,
  showSkip = true,
}) => {
  const { t } = useTranslation();

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
          {!isLastStep && showSkip && (
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

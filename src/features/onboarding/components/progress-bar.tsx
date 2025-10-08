import type React from 'react';
import { Box } from '#root/ui/components';

interface ProgressBarProps {
  progress: number; // 0 to 1
  totalSteps: number;
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <Box paddingHorizontal="lg" paddingVertical="md">
      <Box height={4} backgroundColor="backgroundSecondary" borderRadius="full" overflow="hidden">
        <Box
          height="100%"
          backgroundColor="primary"
          borderRadius="full"
          width={`${progress * 100}%`}
        />
      </Box>
      <Box flexDirection="row" justifyContent="space-between" marginTop="sm">
        <Box />
        <Box />
      </Box>
    </Box>
  );
};

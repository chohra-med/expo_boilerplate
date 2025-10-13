import type { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Icon, Text } from '#root/ui/components';

interface SelectionButtonProps {
  /** The icon name to display */
  iconName: string;
  /** The label text to display */
  label: string;
  /** Whether this option is currently selected */
  isSelected: boolean;
  /** Callback when the button is pressed */
  onPress: () => void;
}

/**
 * Reusable selection button component for settings
 * Used for theme and language selection
 */
export const SelectionButton: React.FC<SelectionButtonProps> = ({
  iconName,
  label,
  isSelected,
  onPress,
}) => {
  return (
    <Box flex={1}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Box
          alignItems="center"
          padding="md"
          backgroundColor={isSelected ? 'primaryBackground' : 'background'}
          borderRadius="md"
          borderWidth={isSelected ? 2 : 1}
          borderColor={isSelected ? 'primary' : 'border'}
        >
          <Icon
            name={iconName as keyof typeof Ionicons.glyphMap}
            size={24}
            color={isSelected ? 'primary' : 'textSecondary'}
          />
          <Text
            variant="caption"
            marginTop="xs"
            color={isSelected ? 'primary' : 'textSecondary'}
            textAlign="center"
          >
            {label}
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

import type React from 'react';
import { useState } from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Box, Button, Card, Text } from './index';

export interface PopupMenuOption {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface PopupMenuProps {
  title: string;
  options: PopupMenuOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  trigger: React.ReactNode;
}

export const PopupMenu: React.FC<PopupMenuProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
  trigger,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsVisible(false);
  };

  const handleOpen = () => {
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleOptionSelect = (value: string) => {
    handleSelect(value);
  };

  const _selectedOption = options.find((option) => option.value === selectedValue);

  return (
    <>
      <TouchableOpacity onPress={handleOpen}>{trigger}</TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <Box
            flex={1}
            backgroundColor="overlay"
            justifyContent="center"
            alignItems="center"
            padding="lg"
          >
            <TouchableWithoutFeedback>
              <Card variant="elevated" minWidth={280}>
                <Text variant="h4" marginBottom="md" textAlign="center">
                  {title}
                </Text>

                <Box gap="sm">
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => handleOptionSelect(option.value)}
                    >
                      <Box
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        padding="md"
                        backgroundColor={
                          option.value === selectedValue ? 'primaryBackground' : 'transparent'
                        }
                        borderRadius="md"
                        borderWidth={option.value === selectedValue ? 1 : 0}
                        borderColor={option.value === selectedValue ? 'primary' : 'transparent'}
                      >
                        <Box flexDirection="row" alignItems="center" flex={1}>
                          {option.icon && <Box marginRight="sm">{option.icon}</Box>}
                          <Text
                            variant="body"
                            color={option.value === selectedValue ? 'primary' : 'text'}
                          >
                            {option.label}
                          </Text>
                        </Box>
                        {option.value === selectedValue && (
                          <Text variant="body" color="primary">
                            ✓
                          </Text>
                        )}
                      </Box>
                    </TouchableOpacity>
                  ))}
                </Box>

                <Box marginTop="md">
                  <Button title="Cancel" onPress={handleClose} buttonTypeVariant="outline" />
                </Box>
              </Card>
            </TouchableWithoutFeedback>
          </Box>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

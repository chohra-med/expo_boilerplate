import type React from "react";
import { useCallback } from "react";
import { Pressable } from "react-native";
import Animated, {
  runOnJS,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Box, Icon, Text } from "#root/ui/components";
import type { TodoItemProps } from "../types";

const AnimatedBox = Animated.createAnimatedComponent(Box);

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, isCompleted }) => {
  const scale = useSharedValue(1);

  const handleToggleComplete = useCallback(() => {
    if (!isCompleted) {
      // Animate completion with scale only (no opacity fade)
      scale.value = withTiming(0.8, { duration: 150 }, (finished) => {
        if (finished) {
          scale.value = withTiming(1, { duration: 150 }, (finished2) => {
            if (finished2) {
              runOnJS(onToggleComplete)(todo.id);
            }
          });
        }
      });
    } else {
      // Animate uncomplete with subtle scale
      scale.value = withTiming(0.95, { duration: 100 }, (finished) => {
        if (finished) {
          scale.value = withTiming(1, { duration: 100 }, (finished2) => {
            if (finished2) {
              runOnJS(onToggleComplete)(todo.id);
            }
          });
        }
      });
    }
  }, [scale, onToggleComplete, todo.id, isCompleted]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <AnimatedBox style={animatedStyle}>
      <Pressable onPress={handleToggleComplete}>
        <Box
          backgroundColor="backgroundSecondary"
          padding="md"
          borderRadius="md"
          flexDirection="row"
          alignItems="center"
          gap="md"
          marginBottom="sm"
        >
          <Box
            width={24}
            height={24}
            borderRadius="full"
            backgroundColor={isCompleted ? "primary" : "border"}
            alignItems="center"
            justifyContent="center"
          >
            {isCompleted && <Icon name="checkmark" size={16} color="white" />}
          </Box>

          <Box flex={1}>
            <Text
              variant="body"
              color={isCompleted ? "textSecondary" : "text"}
              textDecorationLine={isCompleted ? "line-through" : "none"}
            >
              {todo.title}
            </Text>
          </Box>

          <Box
            width={8}
            height={8}
            borderRadius="full"
            backgroundColor={isCompleted ? "success" : "warning"}
          />
        </Box>
      </Pressable>
    </AnimatedBox>
  );

  // Add slide-in animation for completed items
  if (isCompleted) {
    return <Animated.View entering={SlideInRight}>{content}</Animated.View>;
  }

  return content;
};

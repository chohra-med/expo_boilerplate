import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTodos } from '#root/features/todos';
import { Box, Button, Card, Icon, SafeArea, Text } from '#root/ui/components';

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedCard = Animated.createAnimatedComponent(Card);

const HomeScreenComponent: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { todosCount, isLoading } = useTodos();

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-50);
  const cardsOpacity = useSharedValue(0);
  const cardsTranslateY = useSharedValue(50);
  const pulseScale = useSharedValue(1);

  // Separate effect for animations (runs once)
  useEffect(() => {
    // Header animation
    headerOpacity.value = withTiming(1, { duration: 800 });
    headerTranslateY.value = withSpring(0, { damping: 20, stiffness: 100 });

    // Cards animation with delay
    cardsOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    cardsTranslateY.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 100 }));

    // Pulse animation for the activity card
    pulseScale.value = withSequence(
      withTiming(1.05, { duration: 1000 }),
      withTiming(1, { duration: 1000 })
    );
  }, [
    // Cards animation with delay
    cardsOpacity,
    cardsTranslateY, // Header animation
    headerOpacity,
    headerTranslateY, // Pulse animation for the activity card
    pulseScale,
  ]); // Empty dependency array - run once only

  const handleNavigateToTodos = useCallback(() => {
    navigation.navigate('Todos' as never);
  }, [navigation]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const cardsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
    transform: [{ translateY: cardsTranslateY.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    const shimmer = interpolate(pulseScale.value, [1, 1.05, 1], [0, 1, 0], Extrapolate.CLAMP);
    return {
      opacity: shimmer * 0.3,
    };
  });

  return (
    <SafeArea variant="all" backgroundColor="background">
      <ScrollView>
        <Box flex={1} padding="lg">
          {/* Animated Header */}
          <AnimatedBox style={headerAnimatedStyle} marginBottom="xl">
            <Text variant="h1" marginBottom="sm">
              {t('home.title')}
            </Text>
            <Text variant="body" color="textSecondary">
              {t('home.subtitle')}
            </Text>
          </AnimatedBox>

          <AnimatedBox style={cardsAnimatedStyle} gap="lg" flex={1}>
            {/* Recent Activity Card with Pulse Animation */}
            <AnimatedCard
              variant="elevated"
              style={pulseAnimatedStyle}
              padding="lg"
              position="relative"
            >
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginBottom="md"
              >
                <Text variant="h4">{t('home.recentActivity')}</Text>
                <Icon name="pulse" size={24} color="primary" />
              </Box>

              <Box marginBottom="md">
                <Text variant="body" color="textSecondary" marginBottom="sm">
                  {isLoading ? 'Loading todos...' : `You have ${todosCount.active} active todos`}
                </Text>
                <Text variant="caption" color="textSecondary">
                  {todosCount.completed} completed
                </Text>
              </Box>

              <Button
                title="View All Todos"
                onPress={handleNavigateToTodos}
                buttonTypeVariant="primary"
                buttonSizeVariant="small"
              />

              {/* Shimmer effect */}
              <AnimatedBox
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                backgroundColor="primary"
                borderRadius="md"
                style={shimmerAnimatedStyle}
              />
            </AnimatedCard>

            {/* Quick Actions Card */}
            <AnimatedCard variant="outlined" padding="lg">
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginBottom="md"
              >
                <Text variant="h4">{t('home.quickActions')}</Text>
                <Icon name="flash" size={24} color="warning" />
              </Box>

              <Box gap="md">
                <Pressable onPress={handleNavigateToTodos}>
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    padding="md"
                    backgroundColor="backgroundSecondary"
                    borderRadius="md"
                  >
                    <Icon name="list" size={20} color="primary" />
                    <Text variant="body" marginLeft="md" color="primary">
                      Manage Todos
                    </Text>
                    <Box flex={1} alignItems="flex-end">
                      <Icon name="chevron-forward" size={16} color="textSecondary" />
                    </Box>
                  </Box>
                </Pressable>

                <Box
                  flexDirection="row"
                  alignItems="center"
                  padding="md"
                  backgroundColor="backgroundSecondary"
                  borderRadius="md"
                >
                  <Icon name="settings" size={20} color="textSecondary" />
                  <Text variant="body" marginLeft="md" color="textSecondary">
                    App Settings
                  </Text>
                  <Box flex={1} alignItems="flex-end">
                    <Icon name="chevron-forward" size={16} color="textSecondary" />
                  </Box>
                </Box>
              </Box>
            </AnimatedCard>

            {/* Stats Card */}
            <AnimatedCard variant="filled" padding="lg">
              <Text variant="h4" marginBottom="md">
                Your Progress
              </Text>

              <Box flexDirection="row" gap="md">
                <Box flex={1} alignItems="center">
                  <Text variant="h3" color="primary">
                    {todosCount.active}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    Active
                  </Text>
                </Box>
                <Box flex={1} alignItems="center">
                  <Text variant="h3" color="success">
                    {todosCount.completed}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    Completed
                  </Text>
                </Box>
                <Box flex={1} alignItems="center">
                  <Text variant="h3" color="warning">
                    {todosCount.total}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    Total
                  </Text>
                </Box>
              </Box>
            </AnimatedCard>
          </AnimatedBox>
        </Box>
      </ScrollView>
    </SafeArea>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export const HomeScreen = React.memo(HomeScreenComponent);

import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useCoachmarkAnchor, useCoachmarkTour } from "@wireai/activation/coachmarks";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { analytics, EVENTS, FEATURE_NAMES } from "#root/analytics";
import { buildHomeTourSteps, HOME_TOUR_ID } from "#root/config/coachmarks";
import type { AppTabStackParamsList } from "#root/navigation/routes";
import { Box, Button, Card, Icon, SafeArea, Text } from "#root/ui/components";

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedCard = Animated.createAnimatedComponent(Card);

// Navigation type for home screen
type HomeScreenNavigationProp = BottomTabNavigationProp<AppTabStackParamsList, "Home">;

/**
 * Home screen component with clean architecture
 * - All text is translated
 * - No inline styles or functions
 * - Proper memoization for performance
 */
const HomeScreenComponent: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-50);
  const cardsOpacity = useSharedValue(0);
  const cardsTranslateY = useSharedValue(50);
  const pulseScale = useSharedValue(1);

  // Memoized navigation handlers
  const handleNavigateToTodos = useCallback(() => {
    navigation.navigate("Todos", undefined);
  }, [navigation]);

  const handleNavigateToSettings = useCallback(() => {
    navigation.navigate("Settings", { screen: "MainSettings" });
  }, [navigation]);

  // ── Guided tour (@wireai/activation/coachmarks) ──────────────────────────────
  // Register the two most prominent interactive elements as tour anchors. The ids
  // MUST match the `anchorId`s declared in the feature map (src/config/coachmarks.ts).
  const viewTodosAnchor = useCoachmarkAnchor("home_view_todos");
  const settingsAnchor = useCoachmarkAnchor("home_settings");

  // The first-run tour: the whole home feature map, in declared order. Steps must
  // be a stable (memoized) array; step callbacks are held in a ref by the kit, so
  // this rarely needs deps. `buildHomeTourSteps()` routes through `selectTourSteps`
  // so switching to AI-chosen ordering later is a one-line change.
  const tourSteps = useMemo(() => buildHomeTourSteps(), []);

  useCoachmarkTour(tourSteps, {
    tourId: HOME_TOUR_ID, // gate key (persisted once) + analytics prefix
    enabled: true, // domain gate — arm the tour only when it makes sense
    startDelayMs: 500, // let the entrance animations land before the first ring
    onStepShown: (id) =>
      analytics.track(EVENTS.FEATURE_USED, { feature_name: FEATURE_NAMES.HOME, step_id: id }),
  });

  // Animation effects - memoized to prevent recreation
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
  }, [headerOpacity, headerTranslateY, cardsOpacity, cardsTranslateY, pulseScale]);

  // Memoized animated styles
  const headerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    }),
    []
  );

  const cardsAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: cardsOpacity.value,
      transform: [{ translateY: cardsTranslateY.value }],
    }),
    []
  );

  const pulseAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: pulseScale.value }],
    }),
    []
  );

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    const shimmer = interpolate(pulseScale.value, [1, 1.05, 1], [0, 1, 0], Extrapolate.CLAMP);
    return {
      opacity: shimmer * 0.3,
    };
  }, []);

  // Memoized action items to prevent recreation
  const actionItems = useMemo(
    () => [
      {
        id: "todos",
        icon: "list" as const,
        iconColor: "primary" as const,
        text: t("home.manageTodos"),
        textColor: "primary" as const,
        onPress: handleNavigateToTodos,
      },
      {
        id: "settings",
        icon: "settings" as const,
        iconColor: "textSecondary" as const,
        text: t("home.appSettings"),
        textColor: "textSecondary" as const,
        onPress: handleNavigateToSettings,
      },
    ],
    [t, handleNavigateToTodos, handleNavigateToSettings]
  );

  // Memoized action item renderer
  const renderActionItem = useCallback(
    (item: (typeof actionItems)[0]) => (
      <Pressable key={item.id} onPress={item.onPress}>
        <Box
          flexDirection="row"
          alignItems="center"
          padding="md"
          backgroundColor="backgroundSecondary"
          borderRadius="md"
        >
          <Box flexDirection="row" alignItems="center" flex={1}>
            <Icon name={item.icon} size={20} color={item.iconColor} />
            <Text variant="body" marginLeft="md" color={item.textColor}>
              {item.text}
            </Text>
            <Box flex={1} alignItems="flex-end">
              <Icon name="chevron-forward" size={16} color="textSecondary" />
            </Box>
          </Box>
        </Box>
      </Pressable>
    ),
    []
  );

  return (
    <SafeArea>
      <ScrollView>
        <Box flex={1} padding="lg">
          {/* Animated Header */}
          <AnimatedBox style={headerAnimatedStyle} marginBottom="xl">
            <Text variant="h1" marginBottom="sm">
              {t("home.title")}
            </Text>
            <Text variant="body" color="textSecondary">
              {t("home.subtitle")}
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
                <Text variant="h4">{t("home.recentActivity")}</Text>
                <Icon name="pulse" size={24} color="primary" />
              </Box>

              {/* Coachmark anchor: wrap the target in a plain View with
                  collapsable={false} so the native node survives measurement. */}
              <View ref={viewTodosAnchor} collapsable={false}>
                <Button
                  title={t("home.viewAllTodos")}
                  onPress={handleNavigateToTodos}
                  buttonTypeVariant="primary"
                  buttonSizeVariant="small"
                />
              </View>

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
                <Text variant="h4">{t("home.quickActions")}</Text>
                <Icon name="flash" size={24} color="warning" />
              </Box>

              <Box gap="md">
                {actionItems.map((item) =>
                  item.id === "settings" ? (
                    // Coachmark anchor #2: the Settings row.
                    <View key={item.id} ref={settingsAnchor} collapsable={false}>
                      {renderActionItem(item)}
                    </View>
                  ) : (
                    renderActionItem(item)
                  )
                )}
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

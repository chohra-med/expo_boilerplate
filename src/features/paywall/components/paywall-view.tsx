import { useTheme } from "@shopify/restyle";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ImageBackground, ScrollView, StyleSheet } from "react-native";
import { Icon, Pressable, SafeArea } from "#root/ui/components";
import { Box } from "#root/ui/components/box";
import { Button } from "#root/ui/components/button";
import { Text } from "#root/ui/components/text";
import type { Theme } from "#root/ui/style/theme";
import type { PaywallConfig } from "../config/paywall-config";
import type { PaywallPackage } from "../types";
import { PaywallFeaturesList } from "./paywall-features-list";
import { PaywallHeader } from "./paywall-header";
import { PaywallPackageCard } from "./paywall-package-card";

/**
 * Props for the PaywallView presentational component
 */
export type PaywallViewProps = {
  /** Paywall configuration */
  config: PaywallConfig;
  /** Available subscription packages */
  packages: PaywallPackage[];
  /** Currently selected package */
  selectedPackage: PaywallPackage | null;
  /** Whether packages are loading */
  isLoading: boolean;
  /** Whether a purchase is in progress */
  isPurchasing: boolean;
  /** Error message to display */
  error: string | null;
  /** Callback when a package is selected */
  onSelectPackage: (pkg: PaywallPackage) => void;
  /** Callback when purchase button is pressed */
  onPurchase: () => void;
  /** Callback when restore button is pressed */
  onRestore: () => void;
  /** Callback when skip/close button is pressed */
  onSkip: () => void;
};

/**
 * Paywall View Component (Presentational)
 *
 * @description Pure presentational component for paywall screen.
 * Accepts all data and callbacks as props - no Redux or RevenueCat dependency.
 * Use this directly in Storybook or wrap with PaywallScreen for full integration.
 */
const _PaywallView: React.FC<PaywallViewProps> = ({
  config,
  packages,
  selectedPackage,
  isLoading,
  isPurchasing,
  error,
  onSelectPackage,
  onPurchase,
  onRestore,
  onSkip,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();

  const loadingView = useMemo(
    () => (
      <Box flex={1} backgroundColor="background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text variant="body" marginTop="m" color="textSecondary">
          {t("paywall.loading", "Loading subscriptions...")}
        </Text>
      </Box>
    ),
    [theme.colors.accent, t]
  );

  const closeButton = useMemo(() => {
    const canSkip = config.canContinueWithoutTrial ?? config.allowSkip;
    if (!canSkip) return null;

    return (
      <Box position="absolute" top={20} right={20} zIndex="docked" testID="paywall-close-button">
        <Pressable
          onPress={onSkip}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={config.skipButtonText || "Skip paywall"}
        >
          <Box
            width={36}
            height={36}
            borderRadius="pill"
            backgroundColor="surfaceSecondary"
            borderWidth={1}
            borderColor="border"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="close" size={20} color="text" />
          </Box>
        </Pressable>
      </Box>
    );
  }, [config.allowSkip, config.canContinueWithoutTrial, config.skipButtonText, onSkip]);

  const packagesList = useMemo(() => {
    if (packages.length === 0) return null;

    return (
      <Box marginBottom="xxl">
        <Text variant="body" fontWeight="600" marginBottom="l" color="text">
          {t("paywall.choosePlan", "Choose Your Plan")}
        </Text>
        {packages.map((pkg) => (
          <PaywallPackageCard
            key={pkg.identifier}
            package={pkg}
            isSelected={selectedPackage?.identifier === pkg.identifier}
            isBestValue={config.highlightBestValue && pkg.packageType === "ANNUAL"}
            onSelect={onSelectPackage}
          />
        ))}
      </Box>
    );
  }, [packages, selectedPackage, config.highlightBestValue, onSelectPackage, t]);

  const errorMessage = useMemo(() => {
    if (!error) return null;

    return (
      <Box
        backgroundColor="backgroundSecondary"
        padding="l"
        borderRadius="s"
        marginBottom="xxl"
        borderWidth={1}
        borderColor="error"
      >
        <Text variant="bodySmall" color="error" textAlign="center">
          {error}
        </Text>
      </Box>
    );
  }, [error]);

  const trustBadges = useMemo(() => {
    if (!config.showTrustBadges || !config.trustBadges) return null;

    return (
      <Box
        flexDirection="row"
        justifyContent="center"
        flexWrap="wrap"
        marginTop="xxl"
        marginBottom="xxl"
      >
        {config.trustBadges.map((badge: string) => (
          <Box key={badge} marginHorizontal="xs" marginBottom="xs">
            <Text variant="caption" color="textTertiary" textAlign="center">
              {badge}
            </Text>
          </Box>
        ))}
      </Box>
    );
  }, [config.showTrustBadges, config.trustBadges]);

  const bottomSection = useMemo(
    () => (
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="background"
        padding="xxl"
        paddingBottom="xl"
        borderTopWidth={1}
        borderTopColor="border"
        style={{
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 1,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Button
          title={isPurchasing ? t("paywall.processing") : config.ctaButtonText}
          onPress={onPurchase}
          buttonTypeVariant={config.ctaButtonVariant}
          buttonSizeVariant="large"
          disabled={!selectedPackage || isPurchasing}
          loading={isPurchasing}
        />

        <Box flexDirection="row" justifyContent="center" gap="m" marginTop="l">
          <Text variant="caption" color="textTertiary" onPress={onRestore}>
            {config.restoreButtonText}
          </Text>
          <Text variant="caption" color="textTertiary">
            ·
          </Text>
          <Text variant="caption" color="textTertiary">
            {t("paywall.terms", "Terms")}
          </Text>
          <Text variant="caption" color="textTertiary">
            ·
          </Text>
          <Text variant="caption" color="textTertiary">
            {t("paywall.privacy", "Privacy")}
          </Text>
        </Box>
      </Box>
    ),
    [
      isPurchasing,
      config.ctaButtonText,
      config.ctaButtonVariant,
      config.restoreButtonText,
      onPurchase,
      onRestore,
      selectedPackage,
      theme.colors.shadow,
      t,
    ]
  );

  const scrollContentStyle = useMemo(
    () => ({
      padding: theme.spacing.xxl,
      paddingTop: config.allowSkip ? theme.spacing.xxxl + 40 : theme.spacing.xxl,
      paddingBottom: 200,
    }),
    [config.allowSkip, theme.spacing.xxl, theme.spacing.xxxl]
  );

  if (isLoading && packages.length === 0) {
    return loadingView;
  }

  const content = (
    <SafeArea testID="screen-paywall">
      <ScrollView contentContainerStyle={scrollContentStyle} showsVerticalScrollIndicator={false}>
        <PaywallHeader
          title={config.title}
          subtitle={config.subtitle}
          description={config.description}
          showSocialProof={config.showSocialProof}
          socialProofText={config.socialProofText}
        />

        <PaywallFeaturesList features={config.features} />

        {packagesList}

        {errorMessage}

        {trustBadges}
      </ScrollView>

      {bottomSection}

      {closeButton}
    </SafeArea>
  );

  if (config.backgroundImage) {
    return (
      <ImageBackground
        source={{ uri: config.backgroundImage }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        <SafeArea flex={1} backgroundColor="background">
          <Box flex={1} backgroundColor="overlay">
            {content}
          </Box>
        </SafeArea>
      </ImageBackground>
    );
  }

  return (
    <SafeArea flex={1} backgroundColor={config.backgroundColor}>
      {content}
    </SafeArea>
  );
};

export const PaywallView = React.memo(_PaywallView);

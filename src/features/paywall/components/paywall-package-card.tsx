import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Box, Pressable, Text } from "#root/ui/components";
import type { PaywallPackage } from "../types";

/**
 * Props for PaywallPackageCard component
 */
export type PaywallPackageCardProps = {
  /** Package data */
  package: PaywallPackage;
  /** Whether this package is selected */
  isSelected: boolean;
  /** Whether to show "BEST VALUE" badge */
  isBestValue?: boolean;
  /** Callback when package is selected */
  onSelect: (pkg: PaywallPackage) => void;
};

/**
 * PaywallPackageCard Component
 *
 * @description Displays a subscription package card with pricing and selection state.
 *
 * @example
 * ```tsx
 * <PaywallPackageCard
 *   package={packageData}
 *   isSelected={true}
 *   isBestValue={true}
 *   onSelect={handleSelect}
 * />
 * ```
 */
const _PaywallPackageCard: React.FC<PaywallPackageCardProps> = ({
  package: pkg,
  isSelected,
  isBestValue = false,
  onSelect,
}) => {
  const { t } = useTranslation();
  const handlePress = useCallback(() => onSelect(pkg), [onSelect, pkg]);

  const bestValueBadge = useMemo(() => {
    if (!isBestValue) return null;

    return (
      <Box
        backgroundColor="accent"
        paddingHorizontal="xs"
        paddingVertical="xxs"
        borderRadius="pill"
        alignSelf="flex-start"
        marginLeft="s"
      >
        <Text
          variant="overline"
          color="accentInk"
          fontWeight="700"
          fontSize={10}
          letterSpacing={0.6}
        >
          {t("paywall.bestValue")}
        </Text>
      </Box>
    );
  }, [isBestValue, t]);

  const introPriceText = useMemo(() => {
    if (!pkg.product.introPrice) return null;

    return (
      <Text variant="bodySmall" color="accent" marginBottom="xxs">
        {pkg.product.introPrice.priceString} for {pkg.product.introPrice.cycles}{" "}
        {pkg.product.introPrice.period}
      </Text>
    );
  }, [pkg.product.introPrice]);

  return (
    <Pressable
      onPress={handlePress}
      borderWidth={isSelected ? 2 : 1}
      borderColor={isSelected ? "accent" : "border"}
      backgroundColor={isSelected ? "accentSoft" : "surface"}
      padding="xxl"
      borderRadius="s"
      marginBottom="l"
    >
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          {/* Package name row with optional badge */}
          <Box flexDirection="row" alignItems="center" marginBottom="xxs">
            <Text variant="bodyLarge" color="text" fontWeight="600">
              {pkg.product.title}
            </Text>
            {bestValueBadge}
          </Box>

          {introPriceText}

          {/* Price row */}
          <Box flexDirection="row" alignItems="baseline" gap="xxs">
            <Text variant="monoTag" color="textSecondary">
              {pkg.product.priceString}
            </Text>
          </Box>
        </Box>

        {/* Radio circle */}
        <Box
          width={22}
          height={22}
          borderRadius="pill"
          borderWidth={isSelected ? 6 : 2}
          borderColor={isSelected ? "accent" : "borderStrong"}
          backgroundColor="transparent"
        />
      </Box>
    </Pressable>
  );
};

export const PaywallPackageCard = React.memo(_PaywallPackageCard);

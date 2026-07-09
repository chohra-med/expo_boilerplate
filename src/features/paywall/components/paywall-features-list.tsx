import React, { useCallback } from "react";
import { Box, Icon, Text } from "#root/ui/components";

/**
 * Feature item type
 */
export type PaywallFeature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

/**
 * Props for PaywallFeaturesList component
 */
export type PaywallFeaturesListProps = {
  /** Array of features to display */
  features: PaywallFeature[];
};

/**
 * PaywallFeaturesList Component
 *
 * @description Displays a list of premium features with icons and descriptions.
 *
 * @example
 * ```tsx
 * <PaywallFeaturesList
 *   features={[
 *     { id: '1', icon: '🚀', title: 'Fast', description: 'Lightning speed' },
 *     { id: '2', icon: '🔒', title: 'Secure', description: 'Bank-level security' }
 *   ]}
 * />
 * ```
 */
const _PaywallFeaturesList: React.FC<PaywallFeaturesListProps> = ({ features }) => {
  const renderFeature = useCallback((feature: PaywallFeature) => {
    return (
      <Box key={feature.id} flexDirection="row" alignItems="center" gap="s" marginBottom="s">
        <Icon name="checkmark" size={16} color="accent" />
        <Text variant="body" color="textSecondary">
          {feature.title}
        </Text>
      </Box>
    );
  }, []);

  return <Box marginBottom="xxl">{features.map(renderFeature)}</Box>;
};

export const PaywallFeaturesList = React.memo(_PaywallFeaturesList);

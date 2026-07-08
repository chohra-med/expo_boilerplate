import React, { useMemo } from "react";
import { Box, Text } from "#root/ui/components";

export type PaywallHeaderProps = {
  title: string;
  subtitle: string;
  description: string;
  socialProofText?: string;
  showSocialProof?: boolean;
};

const _PaywallHeader: React.FC<PaywallHeaderProps> = ({
  title,
  subtitle,
  description,
  socialProofText,
  showSocialProof = false,
}) => {
  const socialProoof = useMemo(() => {
    if (!showSocialProof || !socialProofText) return null;
    return (
      <Box
        backgroundColor="surfaceSecondary"
        padding="m"
        borderRadius="m"
        borderWidth={1}
        borderColor="border"
        marginBottom="l"
      >
        <Text variant="bodySmall" color="textSecondary" textAlign="center">
          {socialProofText}
        </Text>
      </Box>
    );
  }, [showSocialProof, socialProofText]);

  return (
    <>
      <Box marginBottom="xl">
        <Text variant="title1" marginBottom="s" color="text">
          {title}
        </Text>
        <Text variant="body" color="textSecondary">
          {subtitle}
        </Text>
        {description ? (
          <Text variant="bodySmall" color="textTertiary" marginTop="xs">
            {description}
          </Text>
        ) : null}
      </Box>
      {socialProoof}
    </>
  );
};

export const PaywallHeader = React.memo(_PaywallHeader);

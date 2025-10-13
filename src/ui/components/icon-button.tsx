import type React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Box } from "./box";
import { Icon } from "./icon";

export interface IconButtonProps {
  iconName: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  onPress: () => void;
  buttonTypeVariant?: "primary" | "secondary" | "outline" | "ghost";
  buttonSizeVariant?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  iconSize?: number;
  iconColor?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  onPress,
  buttonTypeVariant = "ghost",
  buttonSizeVariant = "medium",
  disabled = false,
  loading = false,
  iconSize,
  iconColor,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const getVariantProps = () => {
    switch (buttonTypeVariant) {
      case "primary":
        return {
          backgroundColor: "primary" as const,
          borderWidth: 0,
        };
      case "secondary":
        return {
          backgroundColor: "backgroundSecondary" as const,
          borderWidth: 0,
        };
      case "outline":
        return {
          backgroundColor: "transparent" as const,
          borderWidth: 1,
          borderColor: "primary" as const,
        };
      case "ghost":
        return {
          backgroundColor: "transparent" as const,
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: "transparent" as const,
          borderWidth: 0,
        };
    }
  };

  const getSizeProps = () => {
    switch (buttonSizeVariant) {
      case "small":
        return {
          padding: "xs" as const,
          minWidth: 32,
          minHeight: 32,
        };
      case "large":
        return {
          padding: "md" as const,
          minWidth: 56,
          minHeight: 56,
        };
      default:
        return {
          padding: "sm" as const,
          minWidth: 44,
          minHeight: 44,
        };
    }
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;

    switch (buttonTypeVariant) {
      case "primary":
        return "textInverse" as const;
      case "secondary":
        return "text" as const;
      case "outline":
        return "primary" as const;
      case "ghost":
        return "text" as const;
      default:
        return "text" as const;
    }
  };

  const getIconSize = () => {
    if (iconSize) return iconSize;

    switch (buttonSizeVariant) {
      case "small":
        return 16;
      case "large":
        return 28;
      default:
        return 20;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <Box
        {...getVariantProps()}
        {...getSizeProps()}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={buttonTypeVariant === "primary" ? "#FFFFFF" : "#3B82F6"}
          />
        ) : (
          <Icon name={iconName} size={getIconSize()} color={getIconColor()} />
        )}
      </Box>
    </TouchableOpacity>
  );
};

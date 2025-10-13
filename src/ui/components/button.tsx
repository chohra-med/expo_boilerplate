import type React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Box } from "./box";
import { Text } from "./text";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  buttonTypeVariant?: "primary" | "secondary" | "outline" | "ghost" | "selection";
  buttonSizeVariant?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  selected?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  buttonTypeVariant = "primary",
  buttonSizeVariant = "medium",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  selected = false,
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
      case "selection":
        return {
          backgroundColor: selected ? ("accent" as const) : ("backgroundSecondary" as const),
          borderWidth: 1,
          borderColor: selected ? ("accent" as const) : ("border" as const),
        };
      default:
        return {
          backgroundColor: "primary" as const,
          borderWidth: 0,
        };
    }
  };

  const getSizeProps = () => {
    switch (buttonSizeVariant) {
      case "small":
        return {
          paddingHorizontal: "md" as const,
          paddingVertical: "sm" as const,
        };
      case "large":
        return {
          paddingHorizontal: "xl" as const,
          paddingVertical: "lg" as const,
        };
      default:
        return {
          paddingHorizontal: "lg" as const,
          paddingVertical: "md" as const,
        };
    }
  };

  const getTextColor = () => {
    switch (buttonTypeVariant) {
      case "primary":
        return "textInverse" as const;
      case "secondary":
        return "text" as const;
      case "outline":
        return "primary" as const;
      case "ghost":
        return "primary" as const;
      case "selection":
        return selected ? ("textInverse" as const) : ("text" as const);
      default:
        return "textInverse" as const;
    }
  };

  const getTextVariant = () => {
    switch (buttonSizeVariant) {
      case "small":
        return "buttonSmall" as const;
      case "large":
        return "button" as const;
      default:
        return "button" as const;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.7}>
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
          <>
            {leftIcon && <Box marginRight="sm">{leftIcon}</Box>}
            <Text variant={getTextVariant()} color={getTextColor()} textAlign="center">
              {title}
            </Text>
            {rightIcon && <Box marginLeft="sm">{rightIcon}</Box>}
          </>
        )}
      </Box>
    </TouchableOpacity>
  );
};

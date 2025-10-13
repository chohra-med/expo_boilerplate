import type React from "react";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { type StyleProp, TextInput, type TextStyle, TouchableOpacity } from "react-native";
import { useTheme } from "../style/theme-provider";
import { Box } from "./box";
import { Icon } from "./icon";
import { Text } from "./text";

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  autoComplete?: "off" | "email" | "password" | "name" | "tel";
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputTypeVariant?: "default" | "outlined" | "filled";
  inputSizeVariant?: "small" | "medium" | "large";
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      onBlur,
      onFocus,
      error,
      disabled = false,
      secureTextEntry = false,
      keyboardType = "default",
      autoCapitalize = "sentences",
      autoCorrect = true,
      autoComplete = "off",
      multiline = false,
      numberOfLines = 1,
      maxLength,
      leftIcon,
      rightIcon,
      inputTypeVariant = "outlined",
      inputSizeVariant = "medium",
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { theme } = useTheme();
    const handleFocus = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    const getInputContainerProps = useCallback(() => {
      const baseProps = {
        borderWidth: 1,
        borderRadius: "md" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        paddingHorizontal: "md" as const,
        opacity: disabled ? 0.5 : 1,
      };

      switch (inputTypeVariant) {
        case "filled":
          return {
            ...baseProps,
            backgroundColor: "backgroundSecondary" as const,
            borderColor: error ? ("error" as const) : ("transparent" as const),
          };
        case "outlined":
          return {
            ...baseProps,
            backgroundColor: "transparent" as const,
            borderColor: error
              ? ("error" as const)
              : isFocused
                ? ("primary" as const)
                : ("border" as const),
          };
        default:
          return {
            ...baseProps,
            backgroundColor: "transparent" as const,
            borderColor: error ? ("error" as const) : ("border" as const),
          };
      }
    }, [inputTypeVariant, error, isFocused, disabled]);

    const getInputPadding = useCallback(() => {
      switch (inputSizeVariant) {
        case "small":
          return { paddingVertical: "sm" as const };
        case "large":
          return { paddingVertical: "lg" as const };
        default:
          return { paddingVertical: "md" as const };
      }
    }, [inputSizeVariant]);

    const inputStyle = useMemo<StyleProp<TextStyle>>(() => {
      return {
        flex: 1,
        textAlignVertical: multiline ? "top" : ("center" as const),
        color: theme.colors.text,
      };
    }, [multiline, theme.colors.text]);

    return (
      <Box>
        {label && (
          <Text variant="label" color={error ? "error" : "text"} marginBottom="sm">
            {label}
          </Text>
        )}
        <Box {...getInputContainerProps()} {...getInputPadding()}>
          {leftIcon && (
            <Box marginRight="sm" alignItems="center" justifyContent="center">
              {leftIcon}
            </Box>
          )}
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.text}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            autoComplete={autoComplete}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            editable={!disabled}
            style={inputStyle}
          />
          {secureTextEntry && (
            <Box padding="xs">
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="text" />
              </TouchableOpacity>
            </Box>
          )}
          {rightIcon && !secureTextEntry && (
            <Box marginLeft="sm" alignItems="center" justifyContent="center">
              {rightIcon}
            </Box>
          )}
        </Box>
        {error && (
          <Text variant="caption" color="error" marginTop="xs">
            {error}
          </Text>
        )}
      </Box>
    );
  }
);

Input.displayName = "Input";

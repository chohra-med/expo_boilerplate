import { createTheme } from "@shopify/restyle";
import { colors } from "../tokens/colors";
import { opacity } from "../tokens/opacity";
import { zIndices } from "../tokens/z-indices";
import { themeColors } from "./colors-theme";
import { borderRadiusVariants } from "./variants/border-variants";
import * as btnVariants from "./variants/button-variants";
import { cardVariants } from "./variants/card-variants";
import { inputSizeVariants, inputTypeVariants } from "./variants/input-variants";
import { safeAreaVariants } from "./variants/safe-area-variants";
import { shadowVariants } from "./variants/shadow-variants";
import { spacingVariants } from "./variants/spacing-variants";
import { textVariants } from "./variants/text-variants";

// Create base theme configuration
const baseThemeElements = {
  colors: {
    ...colors,
  },
  spacing: spacingVariants,
  borderRadii: borderRadiusVariants,
  zIndices: zIndices,
  opacity: opacity,
  textVariants: textVariants,
  shadowVariants: shadowVariants,
  buttonSizeVariants: btnVariants.buttonSizeVariants,
  buttonTypeVariants: btnVariants.buttonTypeVariants,
  inputTypeVariants: inputTypeVariants,
  inputSizeVariants: inputSizeVariants,
  spacingVariants: spacingVariants,
  safeAreaVariants: safeAreaVariants,
  cardVariants: cardVariants,
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
} satisfies Parameters<typeof createTheme>[0];

// Create light theme
export const lightTheme = createTheme({
  ...baseThemeElements,
  colors: {
    ...colors,
    ...themeColors.light,
  },
});

// Create dark theme
export const darkTheme = createTheme({
  ...baseThemeElements,
  colors: {
    ...colors,
    ...themeColors.dark,
  },
});

// Export the theme type
export type Theme = typeof lightTheme;
// This is just for the provider and typescript for theme switching
export type ProviderTheme = ReturnType<typeof createTheme>;

export type TextVariant = Exclude<keyof Theme["textVariants"], "defaults">;

// Export color scheme type
export type ColorScheme = "light" | "dark";

// Export color types
export type Colors = keyof Theme["colors"];
export type Spacing = keyof Theme["spacing"];
export type BorderRadii = keyof Theme["borderRadii"];

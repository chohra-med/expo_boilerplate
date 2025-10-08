import {
  type BackgroundColorProps,
  type BorderProps,
  backgroundColor,
  border,
  createRestyleComponent,
  type LayoutProps,
  layout,
  type PositionProps,
  type SpacingProps,
  spacing,
} from '@shopify/restyle';
import type React from 'react';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import type { Theme } from '../style/theme';
import { safeAreaVariantsFunction } from '../style/variants/safe-area-variants';

// Define the props type by combining all Restyle prop types
export type SafeAreaViewProps = SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  LayoutProps<Theme> &
  PositionProps<Theme> &
  BorderProps<Theme> &
  React.ComponentProps<typeof RNSafeAreaView> & {
    // Add support for variant prop
    variant?: keyof Theme['safeAreaVariants'];
  };

// Create the SafeAreaView component using the pattern from the article
export const SafeAreaViewBase = createRestyleComponent<SafeAreaViewProps, Theme>(
  [spacing, backgroundColor, layout, border, safeAreaVariantsFunction],
  RNSafeAreaView
);

// Create the Card component with default variant
export const SafeArea = (props: SafeAreaViewProps) => {
  return <SafeAreaViewBase variant="default" {...props} />;
};

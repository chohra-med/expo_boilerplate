import {
  type BackgroundColorProps,
  type BorderProps,
  backgroundColor,
  border,
  createRestyleComponent,
  type LayoutProps,
  layout,
  type PositionProps,
  position,
  type ShadowProps,
  type SpacingProps,
  shadow,
  spacing,
} from "@shopify/restyle";
import type React from "react";
import { Pressable as RNPressable } from "react-native";
import type { Theme } from "../style/theme";

/**
 * Pressable — a Restyle-enabled wrapper around React Native's `Pressable`, so
 * touchable rows can take theme spacing/color/border props directly (used by
 * the paywall package cards and close button).
 */
export type PressableProps = SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  LayoutProps<Theme> &
  PositionProps<Theme> &
  BorderProps<Theme> &
  ShadowProps<Theme> &
  React.ComponentProps<typeof RNPressable>;

export const Pressable = createRestyleComponent<PressableProps, Theme>(
  [spacing, backgroundColor, layout, position, border, shadow],
  RNPressable
);

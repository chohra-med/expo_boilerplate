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
import { View } from "react-native";
import type { Theme } from "../style/theme";

// Define the props type by combining all Restyle prop types
export type BoxProps = SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  LayoutProps<Theme> &
  PositionProps<Theme> &
  BorderProps<Theme> &
  ShadowProps<Theme> &
  React.ComponentProps<typeof View>;

// Create the Box component using the pattern from the article
export const Box = createRestyleComponent<BoxProps, Theme>(
  [spacing, backgroundColor, layout, position, border, shadow],
  View
);

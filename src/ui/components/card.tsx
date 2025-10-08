import {
  type BackgroundColorProps,
  type BorderProps,
  backgroundColor,
  border,
  createRestyleComponent,
  createVariant,
  type LayoutProps,
  layout,
  type PositionProps,
  position,
  type ShadowProps,
  type SpacingProps,
  shadow,
  spacing,
} from '@shopify/restyle';
import { View } from 'react-native';
import type { Theme } from '../style/theme';

// Create card variant function
const cardVariant = createVariant<Theme, 'cardVariants', 'variant'>({
  property: 'variant',
  themeKey: 'cardVariants',
});

// Define the props type by combining all Restyle prop types
export type CardProps = SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  LayoutProps<Theme> &
  PositionProps<Theme> &
  BorderProps<Theme> &
  ShadowProps<Theme> &
  React.ComponentProps<typeof View> & {
    // Add support for variant prop with default value
    variant?: keyof Theme['cardVariants'];
  };

// Create the base Card component
const BaseCard = createRestyleComponent<CardProps, Theme>(
  [spacing, backgroundColor, layout, position, border, shadow, cardVariant],
  View
);

// Create the Card component with default variant
export const Card = (props: CardProps) => {
  return <BaseCard variant="default" {...props} />;
};

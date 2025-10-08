import { createVariant } from '@shopify/restyle';
import type { Theme } from '../theme';

export const safeAreaVariants = {
  defaults: {
    flex: 1,
    backgroundColor: 'background',
  },

  all: {
    flex: 1,
    backgroundColor: 'background',
  },
  default: {
    flex: 1,
    backgroundColor: 'background',
  },
} as const;

export const safeAreaVariantsFunction = createVariant<Theme, 'safeAreaVariants', 'variant'>({
  property: 'variant',
  themeKey: 'safeAreaVariants',
});

export const inputTypeVariants = {
  default: {
    backgroundColor: 'transparent' as const,
    borderWidth: 1,
    borderColor: 'border' as const,
  },
  outlined: {
    backgroundColor: 'transparent' as const,
    borderWidth: 1,
    borderColor: 'border' as const,
  },
  filled: {
    backgroundColor: 'backgroundSecondary' as const,
    borderWidth: 0,
  },
} as const;

export const inputSizeVariants = {
  small: {
    paddingVertical: 'sm' as const,
    paddingHorizontal: 'md' as const,
  },
  medium: {
    paddingVertical: 'md' as const,
    paddingHorizontal: 'md' as const,
  },
  large: {
    paddingVertical: 'lg' as const,
    paddingHorizontal: 'md' as const,
  },
} as const;

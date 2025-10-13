export const buttonSizeVariants = {
  small: {
    paddingHorizontal: "md" as const,
    paddingVertical: "sm" as const,
    borderRadius: "sm" as const,
  },
  medium: {
    paddingHorizontal: "lg" as const,
    paddingVertical: "md" as const,
    borderRadius: "md" as const,
  },
  large: {
    paddingHorizontal: "xl" as const,
    paddingVertical: "lg" as const,
    borderRadius: "md" as const,
  },
} as const;

export const buttonTypeVariants = {
  primary: {
    backgroundColor: "primary" as const,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: "backgroundSecondary" as const,
    borderWidth: 0,
  },
  outline: {
    backgroundColor: "transparent" as const,
    borderWidth: 1,
    borderColor: "primary" as const,
  },
  ghost: {
    backgroundColor: "transparent" as const,
    borderWidth: 0,
  },
  selection: {
    backgroundColor: "accent" as const,
    borderWidth: 1,
    borderColor: "accent" as const,
  },
} as const;

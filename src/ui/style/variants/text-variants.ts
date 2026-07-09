import { fonts } from "../../tokens/fonts";

export const textVariants = {
  defaults: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: "text",
  },
  h1: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
    color: "text",
  },
  h2: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
    color: "text",
  },
  h3: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
    color: "text",
  },
  h4: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
    color: "text",
  },
  h5: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
    color: "text",
  },
  h6: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
    color: "text",
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
    color: "text",
  },
  bodyLarge: {
    fontFamily: fonts.regular,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "400" as const,
    color: "text",
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
    color: "text",
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
    color: "textSecondary",
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    color: "text",
  },
  button: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
    color: "textInverse",
  },
  buttonSmall: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600" as const,
    color: "textInverse",
  },
  overline: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 16,
    fontWeight: "500" as const,
    color: "textSecondary",
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  // Variants used by the ported paywall feature.
  title1: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
    color: "text",
  },
  monoTag: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600" as const,
    color: "text",
  },
} as const;

export type TextTypeVariantProps = {
  variant?: keyof typeof textVariants;
};

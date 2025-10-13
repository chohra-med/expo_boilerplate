export const cardVariants = {
  elevated: {
    backgroundColor: "background" as const,
    borderRadius: "md" as const,
    padding: "md" as const,
    shadowColor: "shadow" as const,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outlined: {
    backgroundColor: "background" as const,
    borderRadius: "md" as const,
    padding: "md" as const,
    borderWidth: 1,
    borderColor: "border" as const,
  },
  filled: {
    backgroundColor: "backgroundSecondary" as const,
    borderRadius: "md" as const,
    padding: "md" as const,
  },
  default: {
    backgroundColor: "background" as const,
    borderRadius: "md" as const,
    padding: "md" as const,
  },
} as const;

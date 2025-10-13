import { StyleSheet } from "react-native";

/**
 * Profile section style constants
 * Centralized styles to avoid inline styling
 */
export const profileStyles = StyleSheet.create({
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  shadowCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowCardLarge: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  shadowAvatar: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  shadowSummary: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  shadowEmpty: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

/**
 * Animation configuration constants
 */
export const animationConfig = {
  fadeIn: {
    toValue: 1,
    duration: 800,
    useNativeDriver: true,
  },
  slideUp: {
    toValue: 0,
    duration: 600,
    useNativeDriver: true,
  },
  spring: {
    toValue: 1,
    tension: 100,
    friction: 8,
    useNativeDriver: true,
  },
  staggerDelay: 100,
} as const;

/**
 * Layout constants
 */
export const layoutConstants = {
  avatarSize: 120,
  questionNumberSize: 32,
  iconSize: {
    small: 16,
    medium: 24,
    large: 48,
    xlarge: 64,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const;

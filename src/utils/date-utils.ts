import type { TFunction } from "i18next";

/**
 * Get current date as ISO string
 */
export const getCurrentISOString = (): string => new Date().toISOString();

/**
 * Format time from date object (HH:mm)
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/**
 * Calculate difference in seconds between two dates
 */
export const diffInSeconds = (date1: Date, date2: Date): number => {
  return Math.floor((date1.getTime() - date2.getTime()) / 1000);
};

/**
 * Format relative time string (e.g. "Just now", "5 minutes ago")
 */
export const formatRelativeTime = (dateString: string, t: TFunction): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = diffInSeconds(now, date);

  if (diff < 60) {
    return t("notifications.history.justNow");
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return t("notifications.history.minutesAgo", { count: minutes });
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return t("notifications.history.hoursAgo", { count: hours });
  } else if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return t("notifications.history.daysAgo", { count: days });
  } else {
    return date.toLocaleDateString();
  }
};

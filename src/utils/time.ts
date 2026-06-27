/**
 * Time Utility Functions
 *
 * @description Utility functions for time formatting and calculations.
 *
 * @example
 * ```typescript
 * import { formatTime, formatDuration, formatRelativeTime } from '#root/utils/time';
 *
 * formatTime(90); // "01:30"
 * formatDuration(3600000); // "1h 0m"
 * formatRelativeTime(Date.now() - 60000); // "1 minute ago"
 * ```
 */

/**
 * Formats seconds into MM:SS format
 *
 * @param seconds - Total seconds to format
 * @returns Formatted time string (e.g., "05:30")
 *
 * @example
 * ```ts
 * formatTime(90) // Returns "01:30"
 * formatTime(3600) // Returns "60:00"
 * formatTime(0) // Returns "00:00"
 * ```
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Formats milliseconds into human-readable duration
 *
 * @param ms - Milliseconds to format
 * @returns Human-readable string (e.g., "2h 30m")
 *
 * @example
 * ```ts
 * formatDuration(3600000) // Returns "1h 0m"
 * formatDuration(5400000) // Returns "1h 30m"
 * formatDuration(300000) // Returns "5m"
 * ```
 */
export const formatDuration = (ms: number): string => {
  const hours = Math.floor(Math.abs(ms) / 3600000);
  const minutes = Math.floor((Math.abs(ms) % 3600000) / 60000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Formats a timestamp into a relative time string
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string (e.g., "5 minutes ago", "2 hours ago")
 *
 * @example
 * ```ts
 * const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
 * formatRelativeTime(fiveMinutesAgo) // Returns "5 minutes ago"
 * ```
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  return "just now";
};

/**
 * Formats seconds into a compact time format (e.g., "1:30" instead of "01:30")
 *
 * @param seconds - Total seconds to format
 * @returns Compact time string
 *
 * @example
 * ```ts
 * formatTimeCompact(90) // Returns "1:30"
 * formatTimeCompact(3600) // Returns "60:00"
 * ```
 */
export const formatTimeCompact = (seconds: number): string => {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Converts time string (HH:MM or MM:SS) to seconds
 *
 * @param timeString - Time string in format "HH:MM" or "MM:SS"
 * @returns Total seconds
 *
 * @example
 * ```ts
 * timeStringToSeconds("01:30") // Returns 90
 * timeStringToSeconds("1:30") // Returns 90
 * ```
 */
export const timeStringToSeconds = (timeString: string): number => {
  const parts = timeString.split(":").map(Number);
  if (parts.length !== 2 || parts.some(Number.isNaN)) {
    return 0;
  }
  const [mins, secs] = parts;
  return mins * 60 + secs;
};

/**
 * Checks if version v1 is lower than version v2
 * @param v1 First version string (e.g. "1.0.0")
 * @param v2 Second version string (e.g. "1.0.1")
 * @returns true if v1 < v2, false otherwise
 */
export const isVersionLower = (v1: string, v2: string): boolean => {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 < num2) return true;
    if (num1 > num2) return false;
  }
  return false;
};

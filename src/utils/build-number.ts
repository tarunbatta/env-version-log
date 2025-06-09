/**
 * Utility class for build number operations
 */
export class BuildNumberUtils {
  /**
   * Returns the next build number as a string.
   */
  static getNextBuildNumber(currentBuildNumber: string): string {
    const num = parseInt(currentBuildNumber, 10);
    if (isNaN(num)) {
      return "1";
    }
    return (num + 1).toString();
  }

  /**
   * Generates a timestamp-based build number (ISO8601, compact).
   */
  static generateTimestampBuildNumber(): string {
    const now = new Date();
    return now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }
}

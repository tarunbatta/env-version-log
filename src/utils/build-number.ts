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
      return '1';
    }
    return (num + 1).toString();
  }

  /**
   * Increments the build number and returns the new value.
   * @param currentBuildNumber The current build number
   * @returns The incremented build number
   */
  static incrementBuildNumber(currentBuildNumber: string): string {
    return this.getNextBuildNumber(currentBuildNumber);
  }

  /**
   * Generates a timestamp-based build number (ISO8601, compact).
   */
  static generateTimestampBuildNumber(): string {
    const now = new Date();
    return now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
}

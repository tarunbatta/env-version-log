/**
 * Simple logger utility
 */
export class Logger {
  static info(message: string, ...args: unknown[]): void {
    console.log('[INFO]', message, ...args);
  }

  static warn(message: string, ...args: unknown[]): void {
    console.warn('[WARN]', message, ...args);
  }

  static error(message: string, ...args: unknown[]): void {
    console.error('[ERROR]', message, ...args);
  }
}

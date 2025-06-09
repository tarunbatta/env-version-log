export class Logger {
  static info(message: string, ...optionalParams: any[]): void {
    console.log("[INFO]", message, ...optionalParams);
  }

  static warn(message: string, ...optionalParams: any[]): void {
    console.warn("[WARN]", message, ...optionalParams);
  }

  static error(message: string, ...optionalParams: any[]): void {
    console.error("[ERROR]", message, ...optionalParams);
  }
}

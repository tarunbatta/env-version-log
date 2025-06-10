/**
 * Simple logger utility
 */
import chalk from 'chalk';
import { VersionInfo } from '../types/versioninfo';

export class Logger {
  private static formatVersionInfo(info: VersionInfo): string {
    const parts = [];
    if (info.appName) parts.push(chalk.cyan(info.appName));
    if (info.version) parts.push(chalk.green(`v${info.version}`));
    if (info.environment) parts.push(chalk.magenta(`[${info.environment}]`));
    if (info.lastUpdated)
      parts.push(chalk.gray(`(Updated: ${new Date(info.lastUpdated).toLocaleString()})`));
    return parts.join(' ');
  }

  static info(message: string | VersionInfo): void {
    if (typeof message === 'string') {
      console.log(chalk.blue('ℹ'), message);
    } else {
      console.log(chalk.blue('ℹ'), this.formatVersionInfo(message));
    }
  }

  static success(message: string | VersionInfo): void {
    if (typeof message === 'string') {
      console.log(chalk.green('✓'), message);
    } else {
      console.log(chalk.green('✓'), this.formatVersionInfo(message));
    }
  }

  static error(message: string | VersionInfo): void {
    if (typeof message === 'string') {
      console.error(chalk.red('✗'), message);
    } else {
      console.error(chalk.red('✗'), this.formatVersionInfo(message));
    }
  }

  static warn(message: string | VersionInfo): void {
    if (typeof message === 'string') {
      console.warn(chalk.yellow('⚠'), message);
    } else {
      console.warn(chalk.yellow('⚠'), this.formatVersionInfo(message));
    }
  }

  static logVersionInfo(info: VersionInfo): void {
    const envEmoji = info.environment === 'production' ? '🚀' : '🔧';
    const timestamp = new Date(info.lastUpdated || new Date()).toLocaleString();

    console.log(`
📦 Application Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 App Name: ${info.appName || 'N/A'}
${envEmoji} Environment: ${info.environment}
🔢 Version: ${info.version || 'N/A'}
⏰ Last Updated: ${timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  }
}

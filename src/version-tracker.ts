import { VersionInfo } from './types/versioninfo';
import { Logger } from './utils/logger';
import { getEnvironment, getAppVersion, getBuildNumber } from './utils/environment';

/**
 * Main class for version and build tracking
 */
export class VersionTracker {
  private static instance: VersionTracker;
  private versionInfo: VersionInfo;

  private constructor(config: Partial<VersionInfo> = {}) {
    this.versionInfo = {
      appName: config.appName || 'Unknown App',
      version: config.version || '0.0.0',
      buildNumber: config.buildNumber || '1',
      environment: getEnvironment() || config.environment || 'development',
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Initializes the VersionTracker singleton
   */
  public static async initialize(config: Partial<VersionInfo> = {}): Promise<VersionTracker> {
    if (!VersionTracker.instance) {
      VersionTracker.instance = new VersionTracker(config);
      Logger.info(VersionTracker.instance.versionInfo);
    }
    return VersionTracker.instance;
  }

  /**
   * Returns the singleton instance
   */
  public static getInstance(): VersionTracker {
    if (!VersionTracker.instance) {
      Logger.error('VersionTracker not initialized. Call initialize() first.');
      throw new Error('VersionTracker not initialized');
    }
    return VersionTracker.instance;
  }

  /**
   * Logs all version information in a formatted way
   */
  logVersionInfo(): void {
    const info = this.getVersionInfo();
    Logger.logVersionInfo(info);
  }

  /**
   * Returns the current version info
   */
  public getVersionInfo(): VersionInfo {
    return { ...this.versionInfo };
  }

  /**
   * Updates the deployment timestamp and logs version info
   */
  public updateDeploymentInfo(): void {
    this.versionInfo.lastUpdated = new Date().toISOString();
    Logger.info(this.versionInfo);
  }

  /**
   * Checks for version updates in env
   */
  public async checkForUpdates(): Promise<boolean> {
    const versionFromEnv = getAppVersion();
    const buildNumberFromEnv = getBuildNumber();
    const environmentFromEnv = getEnvironment();

    let hasUpdates = false;

    if (versionFromEnv && versionFromEnv !== this.versionInfo.version) {
      this.versionInfo.version = versionFromEnv;
      hasUpdates = true;
    }

    if (buildNumberFromEnv && buildNumberFromEnv !== this.versionInfo.buildNumber) {
      this.versionInfo.buildNumber = buildNumberFromEnv;
      hasUpdates = true;
    }

    if (environmentFromEnv && environmentFromEnv !== this.versionInfo.environment) {
      this.versionInfo.environment = environmentFromEnv;
      hasUpdates = true;
    }

    if (hasUpdates) {
      Logger.info(this.versionInfo);
    }

    return hasUpdates;
  }

  /**
   * Increments the build number
   */
  public incrementBuildNumber(): string {
    const currentBuildNumber = parseInt(this.versionInfo.buildNumber, 10);
    const newBuildNumber = isNaN(currentBuildNumber) ? '1' : (currentBuildNumber + 1).toString();
    this.versionInfo.buildNumber = newBuildNumber;
    Logger.success(this.versionInfo);
    return newBuildNumber;
  }

  /**
   * Sets a specific build number
   */
  public setBuildNumber(buildNumber: string): void {
    this.versionInfo.buildNumber = buildNumber;
    Logger.success(this.versionInfo);
  }

  /**
   * Increments the version number based on the specified type (major, minor, or patch)
   */
  public incrementVersion(type: 'major' | 'minor' | 'patch'): string {
    const [major, minor, patch] = this.versionInfo.version!.split('.').map(Number);

    let newVersion: string;
    switch (type) {
      case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
      default:
        throw new Error(`Invalid version type: ${type}`);
    }

    this.versionInfo.version = newVersion;
    Logger.success(this.versionInfo);
    return newVersion;
  }

  /**
   * Sets the version number to a specific value
   */
  public setVersion(version: string): string {
    this.versionInfo.version = version;
    Logger.success(this.versionInfo);
    return version;
  }
}

import { VersionInfo } from './types/versioninfo';
import { Logger } from './utils/logger';
import { getEnvironment, getAppVersion, getAppName } from './utils/environment';

/**
 * Main class for version and build tracking
 */
export class VersionTracker {
  private static instance: VersionTracker;
  private versionInfo: VersionInfo;

  private constructor(config: Partial<VersionInfo> & { packageJsonPath?: string } = {}) {
    this.versionInfo = {
      appName: config.appName || 'Unknown App',
      version: config.version || '0.0.0',
      environment: getEnvironment() || config.environment || 'development',
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Initialize the VersionTracker with optional configuration
   */
  public static async initialize(
    config: Partial<VersionInfo> & { packageJsonPath?: string } = {}
  ): Promise<VersionTracker> {
    if (!VersionTracker.instance) {
      const instance = new VersionTracker(config);

      // Try to get values from environment/package.json
      const [appName, version] = await Promise.all([
        getAppName(config.packageJsonPath),
        getAppVersion(config.packageJsonPath),
      ]);

      if (appName) instance.versionInfo.appName = appName;
      if (version) instance.versionInfo.version = version;

      VersionTracker.instance = instance;
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
   * Get the current version information
   */
  public getVersionInfo(): VersionInfo {
    return { ...this.versionInfo };
  }

  /**
   * Log the current version information
   */
  public logVersionInfo(): void {
    Logger.logVersionInfo(this.versionInfo);
  }

  /**
   * Checks for version updates in env
   */
  public async checkForUpdates(): Promise<boolean> {
    const [versionFromEnv, environmentFromEnv] = await Promise.all([
      getAppVersion(),
      Promise.resolve(getEnvironment()),
    ]);

    let hasUpdates = false;

    if (versionFromEnv && versionFromEnv !== this.versionInfo.version) {
      this.versionInfo.version = versionFromEnv;
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
   * Updates the deployment timestamp and logs version info
   */
  public updateDeploymentInfo(): void {
    this.versionInfo.lastUpdated = new Date().toISOString();
    Logger.info(this.versionInfo);
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

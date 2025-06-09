import { VersionInfo } from './types/versioninfo';
import { FileOperations } from './utils/file-operations';
import { BuildNumberUtils } from './utils/build-number';
import { Logger } from './utils/logger';
import { PackageJson } from './types/packagejson';
import { PackageJsonReadError } from './types/errors';

/**
 * Main class for version and build tracking
 */
export class VersionTracker {
  private static instance: VersionTracker;
  private versionInfo: VersionInfo;
  private packageJsonPath: string;

  private constructor(config: Partial<VersionInfo> = {}, packageJsonPath?: string) {
    this.packageJsonPath = packageJsonPath || FileOperations.findPackageJson();
    const pkg = FileOperations.readPackageJson(this.packageJsonPath);

    // Get version from environment variable, package.json, or config
    const versionFromEnv = process.env.APP_VERSION;
    const version = versionFromEnv || pkg.version || config.version || '0.0.0';

    // Get build number from environment variable, package.json, or config
    const buildNumberFromEnv = process.env.BUILD_NUMBER;
    const buildNumber = buildNumberFromEnv || pkg.buildNumber || config.buildNumber || '1';

    // Get environment from NODE_ENV or config
    const environment = process.env.NODE_ENV || config.environment || 'development';

    this.versionInfo = {
      appName: pkg.name || config.appName,
      version,
      buildNumber,
      environment,
      lastDeployed: new Date().toISOString(),
    };

    Logger.info(this.versionInfo);
  }

  /**
   * Initializes the VersionTracker singleton
   */
  public static initialize(
    config: Partial<VersionInfo> = {},
    packageJsonPath?: string
  ): VersionTracker {
    if (!VersionTracker.instance) {
      VersionTracker.instance = new VersionTracker(config, packageJsonPath);
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
   * Logs the version info to the console
   */
  private logVersionInfo(): void {
    Logger.info(this.versionInfo);
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
    this.versionInfo.lastDeployed = new Date().toISOString();
    Logger.info(this.versionInfo);
  }

  /**
   * Checks for version updates in env or package.json
   */
  public async checkForUpdates(): Promise<boolean> {
    try {
      const pkg = FileOperations.readPackageJson(this.packageJsonPath);
      const versionFromEnv = process.env.APP_VERSION;

      if (versionFromEnv && versionFromEnv !== this.versionInfo.version) {
        this.versionInfo.version = versionFromEnv;
        Logger.info(this.versionInfo);
        return true;
      }

      if (pkg.version && pkg.version !== this.versionInfo.version) {
        this.versionInfo.version = pkg.version;
        Logger.info(this.versionInfo);
        return true;
      }

      return false;
    } catch (error) {
      if (error instanceof PackageJsonReadError) {
        Logger.warn('Could not check for updates: package.json not found');
        return false;
      }
      Logger.error(`Failed to check for updates: ${error}`);
      throw error;
    }
  }

  /**
   * Increments the build number and updates package.json
   */
  public incrementBuildNumber(): string {
    try {
      const pkg = FileOperations.readPackageJson(this.packageJsonPath);
      const newBuildNumber = BuildNumberUtils.getNextBuildNumber(pkg.buildNumber || '1');
      pkg.buildNumber = newBuildNumber;
      FileOperations.writePackageJson(this.packageJsonPath, pkg);

      this.versionInfo.buildNumber = newBuildNumber;
      Logger.success(this.versionInfo);
      return newBuildNumber;
    } catch (error) {
      Logger.error(`Failed to increment build number: ${error}`);
      throw error;
    }
  }

  /**
   * Sets a specific build number and updates package.json
   */
  public setBuildNumber(buildNumber: string): void {
    try {
      const pkg = FileOperations.readPackageJson(this.packageJsonPath);
      pkg.buildNumber = buildNumber;
      FileOperations.writePackageJson(this.packageJsonPath, pkg);

      this.versionInfo.buildNumber = buildNumber;
      Logger.success(this.versionInfo);
    } catch (error) {
      Logger.error(`Failed to set build number: ${error}`);
      throw error;
    }
  }

  private async readPackageJson(): Promise<PackageJson> {
    return FileOperations.readPackageJson(this.packageJsonPath);
  }

  private async writePackageJson(data: PackageJson): Promise<void> {
    await FileOperations.writePackageJson(this.packageJsonPath, data);
  }

  /**
   * Increments the version number based on the specified type (major, minor, or patch)
   * @param type The type of version increment (major, minor, or patch)
   * @returns The new version string
   */
  public async incrementVersion(type: 'major' | 'minor' | 'patch'): Promise<string> {
    try {
      const pkg = FileOperations.readPackageJson(this.packageJsonPath);
      const currentVersion = pkg.version || '0.0.0';
      const [major, minor, patch] = currentVersion.split('.').map(Number);

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

      pkg.version = newVersion;
      FileOperations.writePackageJson(this.packageJsonPath, pkg);

      this.versionInfo.version = newVersion;
      Logger.success(this.versionInfo);
      return newVersion;
    } catch (error) {
      Logger.error(`Failed to increment version: ${error}`);
      throw error;
    }
  }

  /**
   * Sets the version number to a specific value
   * @param version The new version string
   * @returns The new version string
   */
  public async setVersion(version: string): Promise<string> {
    try {
      const pkg = FileOperations.readPackageJson(this.packageJsonPath);
      pkg.version = version;
      FileOperations.writePackageJson(this.packageJsonPath, pkg);

      this.versionInfo.version = version;
      Logger.success(this.versionInfo);
      return version;
    } catch (error) {
      Logger.error(`Failed to set version: ${error}`);
      throw error;
    }
  }
}

import { VersionInfo } from './types/versioninfo';
import { FileOperations } from './utils/file-operations';
import { BuildNumberUtils } from './utils/build-number';
import { Logger } from './utils/logger';

/**
 * Main class for version and build tracking
 */
export class VersionTracker {
  private static instance: VersionTracker;
  private readonly packageJsonPath: string;
  private versionInfo: VersionInfo;

  private constructor(versionInfo: VersionInfo, packageJsonPath?: string) {
    this.versionInfo = versionInfo;
    this.packageJsonPath = packageJsonPath || FileOperations.findPackageJson();
  }

  /**
   * Initializes the VersionTracker singleton
   */
  public static initialize(
    config: Partial<VersionInfo> = {},
    packageJsonPath?: string
  ): VersionTracker {
    if (!VersionTracker.instance) {
      const pkg = FileOperations.readPackageJson(
        packageJsonPath || FileOperations.findPackageJson()
      );

      // Priority order for version:
      // 1. Environment variable (REACT_APP_VERSION or similar)
      // 2. package.json version
      // 3. Config override
      const versionFromEnv = process.env.REACT_APP_VERSION || process.env.VERSION;

      const defaultConfig: VersionInfo = {
        appName: pkg.name,
        version: versionFromEnv || pkg.version,
        buildNumber: pkg.buildNumber || process.env.BUILD_NUMBER || '1',
        environment: process.env.NODE_ENV || 'development',
        lastDeployed: new Date().toISOString(),
      };

      VersionTracker.instance = new VersionTracker(
        { ...defaultConfig, ...config },
        packageJsonPath
      );
      Logger.info('VersionTracker initialized:', VersionTracker.instance.versionInfo);
    }
    return VersionTracker.instance;
  }

  /**
   * Returns the singleton instance
   */
  public static getInstance(): VersionTracker {
    if (!VersionTracker.instance) {
      Logger.error('VersionTracker not initialized. Call initialize() first.');
      throw new Error('VersionTracker not initialized. Call initialize() first.');
    }
    return VersionTracker.instance;
  }

  /**
   * Logs the version info to the console
   */
  public logVersionInfo(): void {
    const { appName, version, buildNumber, environment, lastDeployed } = this.versionInfo;
    Logger.info(
      `%c${appName}%c v${version} (build ${buildNumber}) - ${environment}%c${
        lastDeployed ? `\nLast deployed: ${new Date(lastDeployed).toLocaleString()}` : ''
      }`,
      'color: #4CAF50; font-weight: bold; font-size: 14px;',
      'color: #666; font-size: 12px;',
      'color: #888; font-size: 11px;'
    );
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
    Logger.info('Deployment info updated:', this.versionInfo.lastDeployed);
    this.logVersionInfo();
  }

  /**
   * Checks for version updates in env or package.json
   */
  public async checkForUpdates(): Promise<boolean> {
    try {
      const pkg = FileOperations.readPackageJson(this.packageJsonPath);
      const versionFromEnv = process.env.REACT_APP_VERSION || process.env.VERSION;
      const currentVersion = versionFromEnv || pkg.version;

      if (currentVersion !== this.versionInfo.version) {
        this.versionInfo.version = currentVersion;
        Logger.info('Version updated:', currentVersion);
        this.logVersionInfo();
        return true;
      }
      return false;
    } catch (error) {
      Logger.error('Failed to check for version updates:', error);
      return false;
    }
  }

  /**
   * Increments the build number and updates package.json
   */
  public incrementBuildNumber(): string {
    const pkg = FileOperations.readPackageJson(this.packageJsonPath);
    const nextBuildNumber = BuildNumberUtils.getNextBuildNumber(this.versionInfo.buildNumber);

    // Update in-memory version info
    this.versionInfo.buildNumber = nextBuildNumber;

    // Update package.json
    pkg.buildNumber = nextBuildNumber;
    FileOperations.writePackageJson(this.packageJsonPath, pkg);

    Logger.info('Build number incremented:', nextBuildNumber);
    this.logVersionInfo();
    return nextBuildNumber;
  }

  /**
   * Sets a specific build number and updates package.json
   */
  public setBuildNumber(buildNumber: string): void {
    const pkg = FileOperations.readPackageJson(this.packageJsonPath);

    // Update in-memory version info
    this.versionInfo.buildNumber = buildNumber;

    // Update package.json
    pkg.buildNumber = buildNumber;
    FileOperations.writePackageJson(this.packageJsonPath, pkg);

    Logger.info('Build number set:', buildNumber);
    this.logVersionInfo();
  }
}

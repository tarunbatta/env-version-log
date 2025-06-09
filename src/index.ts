interface VersionInfo {
  appName: string;
  version: string;
  buildNumber: string;
  environment: string;
}

class VersionTracker {
  private static instance: VersionTracker;
  private versionInfo: VersionInfo;

  private constructor(versionInfo: VersionInfo) {
    this.versionInfo = versionInfo;
  }

  public static initialize(config: VersionInfo): VersionTracker {
    if (!VersionTracker.instance) {
      VersionTracker.instance = new VersionTracker(config);
    }
    return VersionTracker.instance;
  }

  public static getInstance(): VersionTracker {
    if (!VersionTracker.instance) {
      throw new Error(
        "VersionTracker not initialized. Call initialize() first."
      );
    }
    return VersionTracker.instance;
  }

  public logVersionInfo(): void {
    console.log(
      `%c${this.versionInfo.appName}%c v${this.versionInfo.version} (build ${this.versionInfo.buildNumber}) - ${this.versionInfo.environment}`,
      "color: #4CAF50; font-weight: bold; font-size: 14px;",
      "color: #666; font-size: 12px;"
    );
  }

  public getVersionInfo(): VersionInfo {
    return { ...this.versionInfo };
  }
}

export { VersionTracker, VersionInfo };

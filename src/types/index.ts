import { VersionInfo } from './versioninfo';
import { PackageJson } from './packagejson';
import { PackageJsonNotFoundError, PackageJsonReadError, PackageJsonWriteError } from './errors';

export type VersionType = 'major' | 'minor' | 'patch';

export interface VersionTrackerConfig extends Partial<VersionInfo> {
  packageJsonPath?: string;
}

export interface VersionTracker {
  getVersionInfo(): VersionInfo;
  updateDeploymentInfo(): void;
  checkForUpdates(): Promise<boolean>;
  setVersion(version: string): Promise<string>;
}

export type { VersionInfo, PackageJson };
export { PackageJsonNotFoundError, PackageJsonReadError, PackageJsonWriteError };

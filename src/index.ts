import { VersionTracker } from './version-tracker';
import { FileOperations } from './utils/file-operations';
import { Logger } from './utils/logger';
import {
  VersionInfo,
  VersionTrackerConfig,
  VersionType,
  PackageJson,
  PackageJsonNotFoundError,
  PackageJsonReadError,
  PackageJsonWriteError,
} from './types';

// Export the main class
export { VersionTracker };

// Export utility classes
export { FileOperations } from './utils/file-operations';
export { Logger } from './utils/logger';
export { getEnvironment, getAppVersion, getAppName } from './utils/environment';

// Export types
export type { VersionInfo, VersionTrackerConfig, VersionType, PackageJson };

// Export errors
export { PackageJsonNotFoundError, PackageJsonReadError, PackageJsonWriteError };

// Export a default instance creator
export const createVersionTracker = async (config: Partial<VersionInfo> = {}) => {
  return VersionTracker.initialize(config);
};

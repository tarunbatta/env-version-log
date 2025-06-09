import { VersionTracker } from './version-tracker';
import { BuildNumberUtils } from './utils/build-number';
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
export { BuildNumberUtils } from './utils/build-number';
export { FileOperations } from './utils/file-operations';
export { Logger } from './utils/logger';

// Export types
export type { VersionInfo, VersionTrackerConfig, VersionType, PackageJson };

// Export errors
export { PackageJsonNotFoundError, PackageJsonReadError, PackageJsonWriteError };

// Export a default instance creator
export const createVersionTracker = async (config: VersionTrackerConfig = {}) => {
  return VersionTracker.initialize(config, config.packageJsonPath);
};

import { jest } from '@jest/globals';
import { FileOperations } from '../../src/utils/file-operations';
import { mockPackageJson, createMockPackageJson } from '../../__mocks__/package-json.mock';
import type { PackageJson } from '../../src/types/packagejson';
import { VersionTracker } from '../../src/version-tracker';

// Mock the FileOperations and BuildNumberUtils
jest.mock('../../src/utils/file-operations');
jest.mock('../../src/utils/build-number');
jest.mock('../../src/utils/logger', () => ({
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    success: jest.fn(),
    logVersionInfo: jest.fn(),
  },
}));

export const setupTestEnvironment = () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the singleton instance
    (VersionTracker as unknown as { instance: VersionTracker | undefined }).instance = undefined;
    
    // Set up FileOperations mocks
    jest.spyOn(FileOperations, 'findPackageJson').mockReturnValue('/path/to/package.json');
    jest.spyOn(FileOperations, 'readPackageJson').mockReturnValue(mockPackageJson);
    jest.spyOn(FileOperations, 'readPackageJsonAsync').mockResolvedValue(mockPackageJson);
    jest.spyOn(FileOperations, 'writePackageJson').mockResolvedValue(undefined);
    
    // Reset process.env
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  return {
    originalEnv,
    mockPackageJson,
    createMockPackageJson,
  };
};

export type { PackageJson };

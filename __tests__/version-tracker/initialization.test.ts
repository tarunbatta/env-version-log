import { VersionTracker } from '../../src/version-tracker';
import { FileOperations } from '../../src/utils/file-operations';
import { setupTestEnvironment } from './setup';
import type { PackageJson } from '../../src/types/packagejson';

describe.skip('VersionTracker Initialization', () => {
  const { mockPackageJson, createMockPackageJson } = setupTestEnvironment();

  it('should initialize with default config', async () => {
    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson as PackageJson);
    const tracker = await VersionTracker.initialize();
    expect(tracker.getVersionInfo()).toEqual({
      appName: 'test-app',
      version: '1.0.0',
      buildNumber: '1',
      environment: 'test',
      lastDeployed: expect.any(String),
    });
  });

  it('should initialize with environment variables', async () => {
    process.env.APP_VERSION = '2.0.0';
    process.env.BUILD_NUMBER = '42';
    process.env.NODE_ENV = 'production';

    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson);

    const tracker = await VersionTracker.initialize();
    expect(tracker.getVersionInfo()).toEqual({
      appName: 'test-app',
      version: '2.0.0',
      buildNumber: '42',
      environment: 'production',
      lastDeployed: expect.any(String),
    });
  });

  it('should initialize with custom config', async () => {
    const customPackageJson = createMockPackageJson({
      version: '3.0.0',
      versionTracker: {
        buildNumber: '100',
        environment: 'staging',
        lastDeployed: '2024-03-19T12:00:00.000Z',
      },
    });
    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(customPackageJson);

    // Set NODE_ENV to undefined to ensure it doesn't override our config
    process.env.NODE_ENV = undefined;

    const tracker = await VersionTracker.initialize({
      appName: 'custom-app',
      version: '3.0.0',
      buildNumber: '100',
      environment: 'staging',
    });

    expect(tracker.getVersionInfo()).toEqual({
      appName: 'test-app',
      version: '3.0.0',
      buildNumber: '100',
      environment: 'staging',
      lastDeployed: expect.any(String),
    });
  });

  it('should handle initialization with invalid package.json path', async () => {
    (FileOperations.findPackageJson as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid package.json path');
    });
    await expect(VersionTracker.initialize()).rejects.toThrow('Invalid package.json path');
  });

  it('should handle initialization with missing package.json fields', async () => {
    const emptyPackageJson = createMockPackageJson({ name: undefined, version: undefined });
    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(emptyPackageJson);
    const tracker = await VersionTracker.initialize();
    const versionInfo = tracker.getVersionInfo();
    expect(versionInfo).toEqual({
      appName: undefined,
      version: '0.0.0',
      buildNumber: '1',
      environment: 'test',
      lastDeployed: expect.any(String),
    });
  });

  it('should handle initialization with custom package.json path', async () => {
    const customPath = '/custom/path/package.json';
    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson);
    await VersionTracker.initialize({}, customPath);
    expect(FileOperations.readPackageJson).toHaveBeenCalledWith(customPath);
  });
});

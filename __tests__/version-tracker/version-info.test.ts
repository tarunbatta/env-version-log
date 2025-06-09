import { VersionTracker } from '../../src/version-tracker';
import { FileOperations } from '../../src/utils/file-operations';
import { setupTestEnvironment } from './setup';
import type { PackageJson } from '../../src/types/packagejson';

describe('VersionTracker Version Info', () => {
  const { mockPackageJson, createMockPackageJson } = setupTestEnvironment();

  it('should get version info', async () => {
    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson as PackageJson);
    const tracker = await VersionTracker.initialize();
    const versionInfo = tracker.getVersionInfo();
    expect(versionInfo).toEqual({
      appName: 'test-app',
      version: '1.0.0',
      buildNumber: '1',
      environment: 'test',
      lastDeployed: expect.any(String),
    });
  });

  it('should update deployment info', async () => {
    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson as PackageJson);
    const tracker = await VersionTracker.initialize();
    const beforeInfo = tracker.getVersionInfo();
    tracker.updateDeploymentInfo();
    const afterInfo = tracker.getVersionInfo();
    expect(afterInfo.lastDeployed).not.toBe(beforeInfo.lastDeployed);
  });

  it('should check for updates', async () => {
    const updatedPackageJson = createMockPackageJson({ version: '2.0.0' });
    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(
      updatedPackageJson as PackageJson
    );
    const tracker = await VersionTracker.initialize();
    const hasUpdates = await tracker.checkForUpdates();
    expect(hasUpdates).toBe(true);
    expect(tracker.getVersionInfo().version).toBe('2.0.0');
  });

  it('should not detect updates when version is the same', async () => {
    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson as PackageJson);
    const tracker = await VersionTracker.initialize();
    const hasUpdates = await tracker.checkForUpdates();
    expect(hasUpdates).toBe(false);
  });

  it('should handle update check errors', async () => {
    (FileOperations.readPackageJson as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error('Failed to read package.json'))
    );
    const tracker = await VersionTracker.initialize();
    await expect(tracker.checkForUpdates()).rejects.toThrow('Failed to read package.json');
  });
});

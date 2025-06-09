import { VersionTracker } from '../../src/version-tracker';
import { FileOperations } from '../../src/utils/file-operations';
import { BuildNumberUtils } from '../../src/utils/build-number';
import { setupTestEnvironment } from './setup';
import type { PackageJson } from '../../src/types/packagejson';

describe.skip('VersionTracker Build Number Management', () => {
  const { createMockPackageJson, mockPackageJson } = setupTestEnvironment();

  it('should increment build number', async () => {
    const initialPackageJson = createMockPackageJson({
      versionTracker: {
        buildNumber: '1',
        lastDeployed: '2024-03-19T12:00:00.000Z',
        environment: 'test',
      },
    });
    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(
      initialPackageJson as PackageJson
    );
    (BuildNumberUtils.getNextBuildNumber as jest.Mock).mockReturnValue('2');
    const tracker = await VersionTracker.initialize();
    const newBuildNumber = await tracker.incrementBuildNumber();
    expect(newBuildNumber).toBe('2');
    expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
      '/path/to/package.json',
      expect.objectContaining({
        versionTracker: expect.objectContaining({ buildNumber: '2' }),
      })
    );
  });

  it('should set specific build number', async () => {
    const initialPackageJson = createMockPackageJson({
      versionTracker: {
        buildNumber: '1',
        lastDeployed: '2024-03-19T12:00:00.000Z',
        environment: 'test',
      },
    });
    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(
      initialPackageJson as PackageJson
    );
    const tracker = await VersionTracker.initialize();
    await tracker.setBuildNumber('42');
    expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
      '/path/to/package.json',
      expect.objectContaining({
        versionTracker: expect.objectContaining({ buildNumber: '42' }),
      })
    );
  });

  it('should handle build number increment errors', async () => {
    (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson as PackageJson);
    (FileOperations.writePackageJson as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error('Failed to write package.json'))
    );
    const tracker = await VersionTracker.initialize();
    await expect(tracker.incrementBuildNumber()).rejects.toThrow('Failed to write package.json');
  });
});

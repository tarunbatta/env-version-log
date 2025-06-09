import { VersionTracker } from '../src/version-tracker';
import { FileOperations } from '../src/utils/file-operations';
import { BuildNumberUtils } from '../src/utils/build-number';

// Mock the FileOperations and BuildNumberUtils
jest.mock('../src/utils/file-operations');
jest.mock('../src/utils/build-number');

describe('VersionTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock findPackageJson to return a path
    (FileOperations.findPackageJson as jest.Mock).mockReturnValue('/path/to/package.json');
  });

  it('should initialize with default config', () => {
    const mockPackageJson = { name: 'test-app', version: '1.0.0' };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
    const tracker = VersionTracker.initialize();
    expect(tracker.getVersionInfo()).toEqual({
      appName: 'test-app',
      version: '1.0.0',
      buildNumber: '1',
      environment: 'test',
      lastDeployed: expect.any(String),
    });
  });

  it('should increment build number', () => {
    const mockPackageJson = {
      name: 'test-app',
      version: '1.0.0',
      buildNumber: '1',
    };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
    (BuildNumberUtils.getNextBuildNumber as jest.Mock).mockReturnValue('2');
    const tracker = VersionTracker.initialize();
    const newBuildNumber = tracker.incrementBuildNumber();
    expect(newBuildNumber).toBe('2');
    expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
      '/path/to/package.json',
      expect.objectContaining({ buildNumber: '2' })
    );
  });

  it('should set build number', () => {
    const mockPackageJson = {
      name: 'test-app',
      version: '1.0.0',
      buildNumber: '1',
    };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
    const tracker = VersionTracker.initialize();
    tracker.setBuildNumber('100');
    expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
      '/path/to/package.json',
      expect.objectContaining({ buildNumber: '100' })
    );
  });

  it('should check for updates', async () => {
    const mockPackageJson = {
      name: 'test-app',
      version: '1.0.0',
      buildNumber: '1',
    };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
    const tracker = VersionTracker.initialize();
    const hasUpdates = await tracker.checkForUpdates();
    expect(hasUpdates).toBe(false);
  });

  it('should throw error when not initialized', () => {
    expect(() => VersionTracker.getInstance()).toThrow('VersionTracker not initialized');
  });

  it('should handle package.json read error', () => {
    (FileOperations.readPackageJson as jest.Mock).mockImplementation(() => {
      throw new Error('Failed to read package.json');
    });
    expect(() => VersionTracker.initialize()).toThrow('Failed to read package.json');
  });

  it('should handle package.json write error', () => {
    const mockPackageJson = {
      name: 'test-app',
      version: '1.0.0',
      buildNumber: '1',
    };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
    (FileOperations.writePackageJson as jest.Mock).mockImplementation(() => {
      throw new Error('Failed to write package.json');
    });
    const tracker = VersionTracker.initialize();
    expect(() => tracker.setBuildNumber('100')).toThrow('Failed to write package.json');
  });
});

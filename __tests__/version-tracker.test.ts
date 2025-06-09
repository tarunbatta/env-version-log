import { VersionTracker } from '../src/version-tracker';
import { FileOperations } from '../src/utils/file-operations';
import { BuildNumberUtils } from '../src/utils/build-number';
import { PackageJsonReadError } from '../src/types/errors';

// Mock the FileOperations and BuildNumberUtils
jest.mock('../src/utils/file-operations');
jest.mock('../src/utils/build-number');

describe('VersionTracker', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the singleton instance
    (VersionTracker as any).instance = undefined;
    // Mock findPackageJson to return a path
    (FileOperations.findPackageJson as jest.Mock).mockReturnValue('/path/to/package.json');
    // Reset process.env
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
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

  it('should initialize with environment variables', () => {
    process.env.REACT_APP_VERSION = '2.0.0';
    process.env.BUILD_NUMBER = '42';
    process.env.NODE_ENV = 'production';

    const mockPackageJson = { name: 'test-app', version: '1.0.0' };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);

    const tracker = VersionTracker.initialize();
    expect(tracker.getVersionInfo()).toEqual({
      appName: 'test-app',
      version: '2.0.0',
      buildNumber: '42',
      environment: 'production',
      lastDeployed: expect.any(String),
    });
  });

  it('should initialize with custom config', () => {
    const mockPackageJson = { name: 'test-app', version: '1.0.0' };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);

    const tracker = VersionTracker.initialize({
      appName: 'custom-app',
      version: '3.0.0',
      buildNumber: '100',
      environment: 'staging',
    });

    expect(tracker.getVersionInfo()).toEqual({
      appName: 'custom-app',
      version: '3.0.0',
      buildNumber: '100',
      environment: 'staging',
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

  it('should detect version updates from env', async () => {
    const mockPackageJson = {
      name: 'test-app',
      version: '1.0.0',
      buildNumber: '1',
    };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
    const tracker = VersionTracker.initialize();

    process.env.REACT_APP_VERSION = '2.0.0';
    const hasUpdates = await tracker.checkForUpdates();
    expect(hasUpdates).toBe(true);
    expect(tracker.getVersionInfo().version).toBe('2.0.0');
  });

  it('should detect version updates from package.json', async () => {
    const initialPackageJson = {
      name: 'test-app',
      version: '1.0.0',
      buildNumber: '1',
    };
    const updatedPackageJson = {
      name: 'test-app',
      version: '2.0.0',
      buildNumber: '1',
    };

    (FileOperations.readPackageJson as jest.Mock)
      .mockReturnValueOnce(initialPackageJson)
      .mockReturnValueOnce(updatedPackageJson);

    const tracker = VersionTracker.initialize();
    const hasUpdates = await tracker.checkForUpdates();
    expect(hasUpdates).toBe(true);
    expect(tracker.getVersionInfo().version).toBe('2.0.0');
  });

  it('should handle update check errors', async () => {
    const mockPackageJson = {
      name: 'test-app',
      version: '1.0.0',
      buildNumber: '1',
    };
    (FileOperations.readPackageJson as jest.Mock)
      .mockReturnValueOnce(mockPackageJson)
      .mockImplementationOnce(() => {
        throw new Error('Failed to read package.json');
      });

    const tracker = VersionTracker.initialize();
    const hasUpdates = await tracker.checkForUpdates();
    expect(hasUpdates).toBe(false);
  });

  it('should throw error when not initialized', () => {
    // Ensure instance is undefined
    (VersionTracker as any).instance = undefined;
    expect(() => VersionTracker.getInstance()).toThrow('VersionTracker not initialized');
  });

  it('should handle package.json read error', () => {
    (FileOperations.readPackageJson as jest.Mock).mockImplementation(() => {
      throw new PackageJsonReadError('Failed to read package.json');
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

  it('should update deployment info', async () => {
    const mockPackageJson = {
      name: 'test-app',
      version: '1.0.0',
      buildNumber: '1',
    };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
    const tracker = VersionTracker.initialize();

    const beforeUpdate = tracker.getVersionInfo().lastDeployed;
    // Add a small delay to ensure timestamps are different
    await new Promise((resolve) => setTimeout(resolve, 1));
    tracker.updateDeploymentInfo();
    const afterUpdate = tracker.getVersionInfo().lastDeployed;

    expect(beforeUpdate).not.toBe(afterUpdate);
  });

  it('should handle initialization with invalid package.json path', () => {
    (FileOperations.findPackageJson as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid package.json path');
    });
    expect(() => VersionTracker.initialize()).toThrow('Invalid package.json path');
  });

  it('should handle initialization with missing package.json fields', () => {
    const mockPackageJson = {};
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
    const tracker = VersionTracker.initialize();
    expect(tracker.getVersionInfo()).toEqual({
      appName: undefined,
      version: undefined,
      buildNumber: '1',
      environment: 'test',
      lastDeployed: expect.any(String),
    });
  });

  it('should handle initialization with custom package.json path', () => {
    const mockPackageJson = { name: 'test-app', version: '1.0.0' };
    const customPath = '/custom/path/package.json';
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
    VersionTracker.initialize({}, customPath);
    expect(FileOperations.readPackageJson).toHaveBeenCalledWith(customPath);
  });

  it('should fall back to package.json version when env variables are not set', () => {
    const mockPackageJson = { name: 'test-app', version: '1.0.0' };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
    // Clear any existing env variables
    delete process.env.REACT_APP_VERSION;
    delete process.env.VERSION;
    const tracker = VersionTracker.initialize();
    expect(tracker.getVersionInfo().version).toBe('1.0.0');
  });

  it('should handle package.json read errors with proper error message', () => {
    const errorMessage = 'Failed to read file';
    (FileOperations.readPackageJson as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });
    expect(() => VersionTracker.initialize()).toThrow(errorMessage);
  });
});

import { VersionTracker } from '../src/version-tracker';
import { FileOperations } from '../src/utils/file-operations';
import { BuildNumberUtils } from '../src/utils/build-number';

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

  describe('Initialization', () => {
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
      process.env.APP_VERSION = '2.0.0';
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
      const versionInfo = tracker.getVersionInfo();
      expect(versionInfo).toEqual({
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
  });

  describe('Version Management', () => {
    it('should increment patch version', async () => {
      const mockPackageJson = {
        name: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
      };
      (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
      const tracker = VersionTracker.initialize();
      const newVersion = await tracker.incrementVersion('patch');
      expect(newVersion).toBe('1.0.1');
      expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        expect.objectContaining({ version: '1.0.1' })
      );
    });

    it('should increment minor version', async () => {
      const mockPackageJson = {
        name: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
      };
      (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
      const tracker = VersionTracker.initialize();
      const newVersion = await tracker.incrementVersion('minor');
      expect(newVersion).toBe('1.1.0');
      expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        expect.objectContaining({ version: '1.1.0' })
      );
    });

    it('should increment major version', async () => {
      const mockPackageJson = {
        name: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
      };
      (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
      const tracker = VersionTracker.initialize();
      const newVersion = await tracker.incrementVersion('major');
      expect(newVersion).toBe('2.0.0');
      expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        expect.objectContaining({ version: '2.0.0' })
      );
    });

    it('should set specific version', async () => {
      const mockPackageJson = {
        name: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
      };
      (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
      const tracker = VersionTracker.initialize();
      const newVersion = await tracker.setVersion('2.1.3');
      expect(newVersion).toBe('2.1.3');
      expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        expect.objectContaining({ version: '2.1.3' })
      );
    });

    it('should handle version increment errors', async () => {
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
      await expect(tracker.incrementVersion('patch')).rejects.toThrow(
        'Failed to write package.json'
      );
    });
  });

  describe('Build Number Management', () => {
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
  });

  describe('Update Checks', () => {
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

      process.env.APP_VERSION = '2.0.0';
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
  });

  describe('Deployment Info', () => {
    it('should update deployment info', async () => {
      const mockPackageJson = {
        name: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
      };
      (FileOperations.readPackageJson as jest.Mock).mockReturnValue(mockPackageJson);
      const tracker = VersionTracker.initialize();

      const beforeUpdate = tracker.getVersionInfo().lastDeployed;
      await new Promise((resolve) => setTimeout(resolve, 10));
      tracker.updateDeploymentInfo();
      const afterUpdate = tracker.getVersionInfo().lastDeployed;

      expect(new Date(beforeUpdate as string).getTime()).toBeLessThan(
        new Date(afterUpdate as string).getTime()
      );
    });
  });
});

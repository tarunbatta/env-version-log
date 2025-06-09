import { VersionTracker } from '../src/version-tracker';
import { FileOperations } from '../src/utils/file-operations';
import { BuildNumberUtils } from '../src/utils/build-number';
import { mockPackageJson, createMockPackageJson } from './__mocks__/package-json.mock';
import { Logger } from '../src/utils/logger';

// Mock the FileOperations and BuildNumberUtils
jest.mock('../src/utils/file-operations');
jest.mock('../src/utils/build-number');
jest.mock('../src/utils/logger', () => ({
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    success: jest.fn(),
  },
}));

describe('VersionTracker', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the singleton instance
    (VersionTracker as any).instance = undefined;
    // Mock findPackageJson to return a path
    (FileOperations.findPackageJson as jest.Mock).mockReturnValue('/path/to/package.json');
    // Mock writePackageJson to resolve successfully by default
    (FileOperations.writePackageJson as jest.Mock).mockResolvedValue(undefined);
    // Reset process.env
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Initialization', () => {
    it('should initialize with default config', async () => {
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson);
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
        versionStamper: {
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

  describe('Version Management', () => {
    it('should increment patch version', async () => {
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson);
      const tracker = await VersionTracker.initialize();
      const newVersion = await tracker.incrementVersion('patch');
      expect(newVersion).toBe('1.0.1');
      expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        expect.objectContaining({ version: '1.0.1' })
      );
    });

    it('should increment minor version', async () => {
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson);
      const tracker = await VersionTracker.initialize();
      const newVersion = await tracker.incrementVersion('minor');
      expect(newVersion).toBe('1.1.0');
      expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        expect.objectContaining({ version: '1.1.0' })
      );
    });

    it('should increment major version', async () => {
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson);
      const tracker = await VersionTracker.initialize();
      const newVersion = await tracker.incrementVersion('major');
      expect(newVersion).toBe('2.0.0');
      expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        expect.objectContaining({ version: '2.0.0' })
      );
    });

    it('should set specific version', async () => {
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson);
      const tracker = await VersionTracker.initialize();
      const newVersion = await tracker.setVersion('2.1.3');
      expect(newVersion).toBe('2.1.3');
      expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        expect.objectContaining({ version: '2.1.3' })
      );
    });

    it('should handle version increment errors', async () => {
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson);
      (FileOperations.writePackageJson as jest.Mock).mockRejectedValue(
        new Error('Failed to write package.json')
      );
      const tracker = await VersionTracker.initialize();
      await expect(tracker.incrementVersion('patch')).rejects.toThrow(
        'Failed to write package.json'
      );
    });
  });

  describe('Build Number Management', () => {
    it('should increment build number', async () => {
      const initialPackageJson = createMockPackageJson({
        versionStamper: {
          buildNumber: '1',
          lastDeployed: '2024-03-19T12:00:00.000Z',
          environment: 'test',
        },
      });
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(initialPackageJson);
      (BuildNumberUtils.getNextBuildNumber as jest.Mock).mockReturnValue('2');
      const tracker = await VersionTracker.initialize();
      const newBuildNumber = await tracker.incrementBuildNumber();
      expect(newBuildNumber).toBe('2');
      expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        expect.objectContaining({
          versionStamper: expect.objectContaining({
            buildNumber: '2',
          }),
        })
      );
    });

    it('should handle build number increment errors', async () => {
      const initialPackageJson = createMockPackageJson({
        versionStamper: {
          buildNumber: '1',
          lastDeployed: '2024-03-19T12:00:00.000Z',
          environment: 'test',
        },
      });
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(initialPackageJson);
      (FileOperations.writePackageJson as jest.Mock).mockRejectedValue(
        new Error('Failed to write package.json')
      );
      const tracker = await VersionTracker.initialize();
      await expect(tracker.incrementBuildNumber()).rejects.toThrow('Failed to write package.json');
    });

    it('should set build number', async () => {
      const initialPackageJson = createMockPackageJson({
        versionStamper: {
          buildNumber: '1',
          lastDeployed: '2024-03-19T12:00:00.000Z',
          environment: 'test',
        },
      });
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(initialPackageJson);
      const tracker = await VersionTracker.initialize();
      await tracker.setBuildNumber('42');
      expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
        '/path/to/package.json',
        expect.objectContaining({
          versionStamper: expect.objectContaining({
            buildNumber: '42',
          }),
        })
      );
    });

    it('should handle set build number errors', async () => {
      const initialPackageJson = createMockPackageJson({
        versionStamper: {
          buildNumber: '1',
          lastDeployed: '2024-03-19T12:00:00.000Z',
          environment: 'test',
        },
      });
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(initialPackageJson);
      (FileOperations.writePackageJson as jest.Mock).mockRejectedValue(
        new Error('Failed to write package.json')
      );
      const tracker = await VersionTracker.initialize();
      await expect(tracker.setBuildNumber('42')).rejects.toThrow('Failed to write package.json');
    });
  });

  describe('Update Checks', () => {
    it('should check for updates', async () => {
      const mockPackageJson = {
        name: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
      };
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson);
      const tracker = await VersionTracker.initialize();
      const hasUpdates = await tracker.checkForUpdates();
      expect(hasUpdates).toBe(false);
    });

    it('should detect version updates from env', async () => {
      const mockPackageJson = {
        name: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
      };
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson);
      const tracker = await VersionTracker.initialize();

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

      const tracker = await VersionTracker.initialize();
      const hasUpdates = await tracker.checkForUpdates();
      expect(hasUpdates).toBe(true);
      expect(tracker.getVersionInfo().version).toBe('2.0.0');
    });

    it('should handle update check errors', async () => {
      const initialPackageJson = createMockPackageJson();
      (FileOperations.readPackageJson as jest.Mock)
        .mockResolvedValueOnce(initialPackageJson)
        .mockRejectedValueOnce(new Error('Failed to read package.json'));

      const tracker = await VersionTracker.initialize();
      await expect(tracker.checkForUpdates()).rejects.toThrow('Failed to read package.json');
      expect(Logger.error).toHaveBeenCalledWith(
        'Failed to check for updates: Error: Failed to read package.json'
      );
    });
  });

  describe('Deployment Info', () => {
    it('should update deployment info', async () => {
      const mockPackageJson = {
        name: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
      };
      (FileOperations.readPackageJson as jest.Mock).mockResolvedValue(mockPackageJson);
      const tracker = await VersionTracker.initialize();

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

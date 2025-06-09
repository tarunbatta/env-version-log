import { BuildNumberUtils } from '../src/utils/build-number';
import { FileOperations } from '../src/utils/file-operations';
import * as path from 'path';
import * as fs from 'fs';
import {
  PackageJsonNotFoundError,
  PackageJsonReadError,
  PackageJsonWriteError,
} from '../src/types/errors';

jest.mock('path');
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

describe('Error Classes', () => {
  describe('PackageJsonNotFoundError', () => {
    it('should create error with default message', () => {
      const error = new PackageJsonNotFoundError();
      expect(error.message).toBe('Could not find package.json in the project directory');
      expect(error.name).toBe('PackageJsonNotFoundError');
    });

    it('should create error with custom message', () => {
      const error = new PackageJsonNotFoundError('Custom error message');
      expect(error.message).toBe('Custom error message');
      expect(error.name).toBe('PackageJsonNotFoundError');
    });
  });

  describe('PackageJsonReadError', () => {
    it('should create error with message', () => {
      const error = new PackageJsonReadError('Failed to read package.json');
      expect(error.message).toBe('Failed to read package.json');
      expect(error.name).toBe('PackageJsonReadError');
    });
  });

  describe('PackageJsonWriteError', () => {
    it('should create error with message', () => {
      const error = new PackageJsonWriteError('Failed to write package.json');
      expect(error.message).toBe('Failed to write package.json');
      expect(error.name).toBe('PackageJsonWriteError');
    });
  });
});

describe('BuildNumberUtils', () => {
  describe('getNextBuildNumber', () => {
    it('should increment a valid build number', () => {
      expect(BuildNumberUtils.getNextBuildNumber('1')).toBe('2');
      expect(BuildNumberUtils.getNextBuildNumber('42')).toBe('43');
      expect(BuildNumberUtils.getNextBuildNumber('999')).toBe('1000');
    });

    it('should return 1 for invalid build numbers', () => {
      expect(BuildNumberUtils.getNextBuildNumber('invalid')).toBe('1');
      expect(BuildNumberUtils.getNextBuildNumber('')).toBe('1');
      expect(BuildNumberUtils.getNextBuildNumber('abc')).toBe('1');
    });
  });

  describe('generateTimestampBuildNumber', () => {
    it('should generate a valid timestamp build number', () => {
      const buildNumber = BuildNumberUtils.generateTimestampBuildNumber();
      expect(buildNumber).toMatch(/^\d{8}T\d{6}Z$/);
    });

    it('should generate different build numbers for different times', () => {
      const buildNumber1 = BuildNumberUtils.generateTimestampBuildNumber();
      // Wait a bit to ensure different timestamps
      setTimeout(() => {
        const buildNumber2 = BuildNumberUtils.generateTimestampBuildNumber();
        expect(buildNumber1).not.toBe(buildNumber2);
      }, 100);
    });
  });
});

describe('FileOperations', () => {
  const mockPackageJson = {
    name: 'test-app',
    version: '1.0.0',
    versionStamper: {
      buildNumber: '1',
      lastDeployed: '2024-03-19T12:00:00.000Z',
      environment: 'test',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockPackageJson));
    (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    (path.dirname as jest.Mock).mockImplementation((dir) => dir.split('/').slice(0, -1).join('/'));
    (path.parse as jest.Mock).mockReturnValue({ root: '/' });
  });

  describe('findPackageJson', () => {
    it('should find package.json in current directory', () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
      const result = FileOperations.findPackageJson();
      expect(result).toBe('process.cwd()/package.json');
    });

    it('should find package.json in parent directory', () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);
      const result = FileOperations.findPackageJson();
      expect(result).toBe('process.cwd()/../package.json');
    });

    it('should throw error if package.json not found', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      expect(() => FileOperations.findPackageJson()).toThrow(PackageJsonNotFoundError);
    });
  });

  describe('readPackageJson', () => {
    it('should read and parse valid package.json', async () => {
      const result = await FileOperations.readPackageJson('package.json');
      expect(result).toEqual(mockPackageJson);
    });

    it('should throw error for invalid JSON', async () => {
      (fs.promises.readFile as jest.Mock).mockResolvedValueOnce('invalid json');
      await expect(FileOperations.readPackageJson('package.json')).rejects.toThrow(
        PackageJsonReadError
      );
    });

    it('should throw error for file read failure', async () => {
      (fs.promises.readFile as jest.Mock).mockRejectedValueOnce(new Error('File not found'));
      await expect(FileOperations.readPackageJson('package.json')).rejects.toThrow(
        PackageJsonReadError
      );
    });
  });

  describe('writePackageJson', () => {
    it('should write valid package.json', async () => {
      await FileOperations.writePackageJson('package.json', mockPackageJson);
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        'package.json',
        JSON.stringify(mockPackageJson, null, 2) + '\n',
        'utf8'
      );
    });

    it('should throw error for write failure', async () => {
      (fs.promises.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Permission denied'));
      await expect(
        FileOperations.writePackageJson('package.json', mockPackageJson)
      ).rejects.toThrow(PackageJsonWriteError);
    });
  });
});

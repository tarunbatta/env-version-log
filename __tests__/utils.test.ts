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

describe('BuildNumberUtils', () => {
  describe('getNextBuildNumber', () => {
    it('should increment a valid build number', () => {
      expect(BuildNumberUtils.getNextBuildNumber('1')).toBe('2');
      expect(BuildNumberUtils.getNextBuildNumber('99')).toBe('100');
    });

    it('should return 1 for invalid build numbers', () => {
      expect(BuildNumberUtils.getNextBuildNumber('invalid')).toBe('1');
      expect(BuildNumberUtils.getNextBuildNumber('')).toBe('1');
    });
  });

  describe('generateTimestampBuildNumber', () => {
    it('should generate a valid timestamp build number', () => {
      const buildNumber = BuildNumberUtils.generateTimestampBuildNumber();
      expect(buildNumber).toMatch(/^\d{8}T\d{6}Z$/);
    });
  });
});

describe('FileOperations', () => {
  const mockPackageJsonPath = '/test/package.json';
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
    (path.join as jest.Mock).mockReturnValue(mockPackageJsonPath);
    (path.dirname as jest.Mock).mockReturnValue('/test');
    (path.parse as jest.Mock).mockReturnValue({ root: '/' });
  });

  describe('findPackageJson', () => {
    it('should find package.json in current directory', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      expect(FileOperations.findPackageJson()).toBe(mockPackageJsonPath);
    });

    it('should find package.json in parent directory', () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);
      expect(FileOperations.findPackageJson()).toBe(mockPackageJsonPath);
    });

    it('should throw PackageJsonNotFoundError when not found', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      expect(() => FileOperations.findPackageJson()).toThrow(PackageJsonNotFoundError);
    });
  });

  describe('readPackageJson', () => {
    it('should read and parse package.json successfully', async () => {
      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockPackageJson));
      const result = await FileOperations.readPackageJson(mockPackageJsonPath);
      expect(result).toEqual(mockPackageJson);
    });

    it('should throw PackageJsonReadError on read failure', async () => {
      (fs.promises.readFile as jest.Mock).mockRejectedValue(new Error('Read error'));
      await expect(FileOperations.readPackageJson(mockPackageJsonPath)).rejects.toThrow(
        PackageJsonReadError
      );
    });

    it('should throw PackageJsonReadError on parse failure', async () => {
      (fs.promises.readFile as jest.Mock).mockResolvedValue('invalid json');
      await expect(FileOperations.readPackageJson(mockPackageJsonPath)).rejects.toThrow(
        PackageJsonReadError
      );
    });
  });

  describe('writePackageJson', () => {
    it('should write package.json successfully', async () => {
      await FileOperations.writePackageJson(mockPackageJsonPath, mockPackageJson);
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        mockPackageJsonPath,
        JSON.stringify(mockPackageJson, null, 2) + '\n',
        'utf8'
      );
    });

    it('should throw PackageJsonWriteError on write failure', async () => {
      (fs.promises.writeFile as jest.Mock).mockRejectedValue(new Error('Write error'));
      await expect(
        FileOperations.writePackageJson(mockPackageJsonPath, mockPackageJson)
      ).rejects.toThrow(PackageJsonWriteError);
    });
  });
});

import { BuildNumberUtils } from '../src/utils/build-number';
import { FileOperations } from '../src/utils/file-operations';
import * as fs from 'fs';
import * as path from 'path';
import {
  PackageJsonNotFoundError,
  PackageJsonReadError,
  PackageJsonWriteError,
} from '../src/types/errors';

jest.mock('fs');
jest.mock('path');

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
    name: 'test-package',
    version: '1.0.0',
    buildNumber: '1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (path.join as jest.Mock).mockReturnValue(mockPackageJsonPath);
    (path.dirname as jest.Mock).mockReturnValue('/test');
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
    it('should read and parse package.json successfully', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockPackageJson));
      const result = FileOperations.readPackageJson(mockPackageJsonPath);
      expect(result).toEqual(mockPackageJson);
    });

    it('should throw PackageJsonReadError on read failure', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Read error');
      });
      expect(() => FileOperations.readPackageJson(mockPackageJsonPath)).toThrow(
        PackageJsonReadError
      );
    });

    it('should throw PackageJsonReadError on parse failure', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');
      expect(() => FileOperations.readPackageJson(mockPackageJsonPath)).toThrow(
        PackageJsonReadError
      );
    });
  });

  describe('writePackageJson', () => {
    it('should write package.json successfully', () => {
      FileOperations.writePackageJson(mockPackageJsonPath, mockPackageJson);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        mockPackageJsonPath,
        JSON.stringify(mockPackageJson, null, 2) + '\n'
      );
    });

    it('should throw PackageJsonWriteError on write failure', () => {
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Write error');
      });
      expect(() => FileOperations.writePackageJson(mockPackageJsonPath, mockPackageJson)).toThrow(
        PackageJsonWriteError
      );
    });
  });
});

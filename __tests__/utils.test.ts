import { FileOperations } from '../src/utils/file-operations';
import * as path from 'path'; // Keep this import for original types if needed
import * as fs from 'fs';
import {
  PackageJsonNotFoundError,
  PackageJsonReadError,
  PackageJsonWriteError,
} from '../src/types/errors';

// Mock the Logger utility as FileOperations uses it
import { Logger } from '../src/utils/logger';
jest.mock('../src/utils/logger', () => ({
  Logger: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

// --- Start of Robust Path Mocks (The most common workaround for the hoisting issue) ---
const mockPathSeparator = '/';

// Declare a variable to hold the reference to the actual mock functions.
// This will be assigned *inside* the jest.mock factory after the functions are created.
let mockedPathModule: {
  join: jest.Mock<string, string[]>;
  basename: jest.Mock<string, [string]>;
  dirname: jest.Mock<string, [string]>;
  parse: jest.Mock<path.ParsedPath, [string]>;
};

// Apply the mock implementation to the 'path' module.
// The factory function is executed immediately by Jest.
jest.mock('path', () => {
  // Define the core logic for each path function *inside* this factory.
  // This is the key to avoiding the ReferenceError.
  const joinFn = jest.fn((...args: string[]) => args.filter(Boolean).join(mockPathSeparator));
  const basenameFn = jest.fn((p: string) => {
    const parts = p.split(mockPathSeparator).filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : '';
  });
  const dirnameFn = jest.fn((p: string) => {
    if (p === mockPathSeparator) return mockPathSeparator;
    const parts = p.split(mockPathSeparator).filter(Boolean);
    if (parts.length <= 1) return mockPathSeparator;
    return mockPathSeparator + parts.slice(0, -1).join(mockPathSeparator);
  });
  const parseFn = jest.fn((p: string): path.ParsedPath => {
    const root = p.startsWith(mockPathSeparator) ? mockPathSeparator : '';
    // Reference the functions defined locally within this factory closure.
    const dir = dirnameFn(p); // Use the locally defined function
    const base = basenameFn(p); // Use the locally defined function
    const extMatch = base.match(/\.([^.]+)$/);
    const ext = extMatch ? `.${extMatch[1]}` : '';
    const name = ext ? base.slice(0, base.length - ext.length) : base;
    return { root, dir, base, ext, name };
  });

  // Construct the object to be returned by the mock factory.
  const mockObject = {
    join: joinFn,
    basename: basenameFn,
    dirname: dirnameFn,
    parse: parseFn,
  };

  // Assign the mock object to the external `mockedPathModule` variable.
  // This is what allows `beforeEach` to access the mock functions.
  mockedPathModule = mockObject;
  return mockObject;
});
// --- End of Robust Path Mocks ---

// Mock `fs` module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

// Mock process.cwd() outside of describe blocks for global control
const mockProcessCwd = jest.spyOn(process, 'cwd');

describe('Error Classes', () => {
  // ... (Your existing Error Classes tests)
});

describe('BuildNumberUtils', () => {
  // ... (Your existing BuildNumberUtils tests)
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
    // jest.clearAllMocks() should now effectively clear the mocks,
    // as mockedPathModule correctly references the jest.fn() instances.
    jest.clearAllMocks();

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockPackageJson));
    (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

    // Explicitly clear path mocks using the `mockedPathModule` variable.
    // This provides extra robustness.
    mockedPathModule.join.mockClear();
    mockedPathModule.basename.mockClear();
    mockedPathModule.dirname.mockClear();
    mockedPathModule.parse.mockClear();

    mockProcessCwd.mockReturnValue('/mock/project/root');
  });

  describe('findPackageJson', () => {
    it('should find package.json in current directory', () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

      const result = FileOperations.findPackageJson();

      expect(result).toBe('/mock/project/root/package.json');
      expect(mockProcessCwd).toHaveBeenCalledTimes(1);
      expect(mockProcessCwd).toHaveBeenCalledWith();
      expect(mockedPathModule.join).toHaveBeenCalledTimes(1);
      expect(mockedPathModule.join).toHaveBeenCalledWith('/mock/project/root', 'package.json');
      expect(fs.existsSync).toHaveBeenCalledTimes(1);
      expect(fs.existsSync).toHaveBeenCalledWith('/mock/project/root/package.json');
    });

    it('should find package.json in parent directory', () => {
      mockProcessCwd.mockReturnValue('/mock/project/root/src');

      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

      const result = FileOperations.findPackageJson();

      expect(result).toBe('/mock/project/root/package.json');
      expect(mockProcessCwd).toHaveBeenCalledTimes(1);
      expect(mockedPathModule.join).toHaveBeenCalledTimes(2);
      expect(mockedPathModule.join).toHaveBeenCalledWith('/mock/project/root/src', 'package.json');
      expect(mockedPathModule.join).toHaveBeenCalledWith('/mock/project/root', 'package.json');
      expect(fs.existsSync).toHaveBeenCalledTimes(2);
      expect(fs.existsSync).toHaveBeenCalledWith('/mock/project/root/src/package.json');
      expect(fs.existsSync).toHaveBeenCalledWith('/mock/project/root/package.json');
      expect(mockedPathModule.dirname).toHaveBeenCalledTimes(1);
      expect(mockedPathModule.dirname).toHaveBeenCalledWith('/mock/project/root/src');
      expect(mockedPathModule.parse).toHaveBeenCalled();
    });

    it('should throw error if package.json not found', () => {
      mockProcessCwd.mockReturnValue('/mock/project/root/sub/sub2');

      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const spyErrorLogger = jest.spyOn(Logger, 'error');

      expect(() => FileOperations.findPackageJson()).toThrow(PackageJsonNotFoundError);

      expect(spyErrorLogger).toHaveBeenCalledTimes(1);
      expect(spyErrorLogger).toHaveBeenCalledWith(
        'Error finding package.json: PackageJsonNotFoundError: package.json not found'
      );

      expect(fs.existsSync).toHaveBeenCalledWith('/mock/project/root/sub/sub2/package.json');
      expect(fs.existsSync).toHaveBeenCalledWith('/mock/project/root/sub/package.json');
      expect(fs.existsSync).toHaveBeenCalledWith('/mock/project/root/package.json');
      expect(fs.existsSync).toHaveBeenCalledWith('/mock/project/package.json');
      expect(fs.existsSync).toHaveBeenCalledWith('/mock/package.json');
      expect(fs.existsSync).toHaveBeenCalledWith('/package.json');
    });
  });

  describe('readPackageJson', () => {
    const testFilePath = '/some/path/package.json';

    it('should read and parse valid package.json', async () => {
      (fs.promises.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockPackageJson));
      const result = await FileOperations.readPackageJson(testFilePath);
      expect(result).toEqual(mockPackageJson);
      expect(fs.promises.readFile).toHaveBeenCalledWith(testFilePath, 'utf8');
    });

    it('should throw error for invalid JSON', async () => {
      (fs.promises.readFile as jest.Mock).mockResolvedValueOnce('invalid json {');
      await expect(FileOperations.readPackageJson(testFilePath)).rejects.toThrow(
        PackageJsonReadError
      );
      expect(fs.promises.readFile).toHaveBeenCalledWith(testFilePath, 'utf8');
    });

    it('should throw error for file read failure', async () => {
      (fs.promises.readFile as jest.Mock).mockRejectedValueOnce(
        new Error('File not found error from fs')
      );
      await expect(FileOperations.readPackageJson(testFilePath)).rejects.toThrow(
        new PackageJsonReadError('Failed to read package.json: Error: File not found error from fs')
      );
      expect(fs.promises.readFile).toHaveBeenCalledWith(testFilePath, 'utf8');
    });
  });

  describe('writePackageJson', () => {
    const testFilePath = '/some/path/package.json';
    const dataToWrite = { name: 'new-app', version: '1.1.0' };

    it('should write valid package.json', async () => {
      await FileOperations.writePackageJson(testFilePath, dataToWrite);
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        testFilePath,
        JSON.stringify(dataToWrite, null, 2) + '\n',
        'utf8'
      );
      expect(Logger.success).toHaveBeenCalledWith('Successfully wrote package.json');
    });

    it('should throw error for write failure', async () => {
      (fs.promises.writeFile as jest.Mock).mockRejectedValueOnce(
        new Error('Permission denied error from fs')
      );
      await expect(FileOperations.writePackageJson(testFilePath, dataToWrite)).rejects.toThrow(
        new PackageJsonWriteError(
          'Failed to write package.json: Error: Permission denied error from fs'
        )
      );
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        testFilePath,
        JSON.stringify(dataToWrite, null, 2) + '\n',
        'utf8'
      );
    });
  });
});

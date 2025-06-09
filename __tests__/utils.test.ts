import { jest } from '@jest/globals';
import { FileOperations } from '../src/utils/file-operations';
import { BuildNumberUtils } from '../src/utils/build-number';

// Mock fs module
const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();
const mockExistsSync = jest.fn();

// Add debug logging to mocks
mockReadFileSync.mockImplementation((...args) => {
  console.log('mockReadFileSync called with:', args);
  return '{}';
});

mockExistsSync.mockImplementation((...args) => {
  console.log('mockExistsSync called with:', args);
  return true;
});

jest.mock('fs', () => {
  console.log('fs module being mocked');
  return {
    readFileSync: mockReadFileSync,
    writeFileSync: mockWriteFileSync,
    existsSync: mockExistsSync,
    promises: {
      readFile: jest.fn(),
      writeFile: jest.fn(),
    },
  };
});

// Mock path module
const mockJoin = jest.fn();
const mockDirname = jest.fn();
const mockParse = jest.fn();

mockJoin.mockImplementation((...args) => {
  console.log('mockJoin called with:', args);
  return '/mock/path/package.json';
});

mockDirname.mockImplementation((...args) => {
  console.log('mockDirname called with:', args);
  return '/mock/path';
});

mockParse.mockImplementation((...args) => {
  console.log('mockParse called with:', args);
  return { root: '/' };
});

jest.mock('path', () => {
  console.log('path module being mocked');
  return {
    join: mockJoin,
    dirname: mockDirname,
    parse: mockParse,
  };
});

describe.skip('FileOperations', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Default existsSync to true
    mockExistsSync.mockReturnValue(true);
    // Default readFileSync to return empty object
    mockReadFileSync.mockReturnValue('{}');
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('readPackageJson', () => {
    it('should read and parse package.json file', () => {
      // Arrange
      const mockPackageJson = {
        name: 'test-app',
        version: '1.0.0',
      };

      // Mock fs.readFileSync to return our mock data
      mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockPackageJson));

      // Act
      const result = FileOperations.readPackageJson();

      // Assert
      expect(result).toEqual(mockPackageJson);
      expect(mockReadFileSync).toHaveBeenCalledWith('/mock/path/package.json', 'utf8');
      // Verify mocks were called
      expect(mockJoin.mock.calls.length).toBeGreaterThan(0);
      expect(mockReadFileSync.mock.calls.length).toBeGreaterThan(0);
    });

    it('should throw error if package.json not found', () => {
      // Arrange
      mockExistsSync.mockReturnValue(false);

      // Act & Assert
      expect(() => FileOperations.readPackageJson()).toThrow('package.json not found');
      // Verify mocks were called
      expect(mockJoin.mock.calls.length).toBeGreaterThan(0);
      expect(mockExistsSync.mock.calls.length).toBeGreaterThan(0);
    });
  });
});

describe('BuildNumberUtils', () => {
  describe('incrementBuildNumber', () => {
    it('should increment build number', () => {
      // Arrange
      const currentBuildNumber = '42';

      // Act
      const newBuildNumber = BuildNumberUtils.incrementBuildNumber(currentBuildNumber);

      // Assert
      expect(newBuildNumber).toBe('43');
    });

    it('should handle non-numeric build numbers', () => {
      // Arrange
      const currentBuildNumber = 'abc';

      // Act
      const newBuildNumber = BuildNumberUtils.incrementBuildNumber(currentBuildNumber);

      // Assert
      expect(newBuildNumber).toBe('1');
    });
  });
});

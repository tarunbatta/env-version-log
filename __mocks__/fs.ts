import { jest } from '@jest/globals';

const mockReadFileSync = jest.fn();
const mockWriteFileSync = jest.fn();
const mockExistsSync = jest.fn();

// Mock the promises API
const mockReadFile = jest.fn();
const mockWriteFile = jest.fn();

export const readFileSync = mockReadFileSync;
export const writeFileSync = mockWriteFileSync;
export const existsSync = mockExistsSync;
export const promises = {
  readFile: mockReadFile,
  writeFile: mockWriteFile,
};

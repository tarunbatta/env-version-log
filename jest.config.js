/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // Performance optimizations
  maxWorkers: '50%', // Use 50% of available CPU cores
  testTimeout: 1000, // 1 second timeout per test
  maxConcurrency: 5, // Run 5 tests in parallel
  bail: 1, // Stop on first failure
  verbose: false, // Reduce output verbosity
  // Optimize coverage collection
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/types/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};

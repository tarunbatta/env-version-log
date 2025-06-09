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
  coverageReporters: ['text-summary'], // Simplified coverage reporting
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // Performance optimizations
  maxWorkers: 1, // Run tests sequentially
  testTimeout: 5000, // 5 second timeout per test
  maxConcurrency: 1, // No parallel execution
  bail: 1, // Stop on first failure
  verbose: false, // Reduce output verbosity
  // Enable test caching
  cache: true,
  cacheDirectory: '.jest-cache',
  // Optimize coverage collection
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/__tests__/'],
  // Add test environment options
  testEnvironmentOptions: {
    NODE_OPTIONS: '--max-old-space-size=1024 --expose-gc', // Reduced memory limit and enable manual GC
  },
};

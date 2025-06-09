import { PackageJson } from '../../src/types/packagejson';

export const mockPackageJson = {
  name: 'test-app',
  version: '1.0.0',
  versionStamper: {
    buildNumber: '1',
    lastDeployed: '2024-03-19T12:00:00.000Z',
    environment: 'test',
  },
  // Add other common package.json fields that might be needed in tests
  description: 'Test application',
  main: 'index.js',
  scripts: {
    test: 'jest',
    start: 'node index.js',
  },
  dependencies: {
    express: '^4.17.1',
  },
  devDependencies: {
    jest: '^27.0.0',
  },
};

// Helper function to create a mock package.json with custom values
export const createMockPackageJson = (overrides: Partial<PackageJson> = {}) => ({
  ...mockPackageJson,
  ...overrides,
  versionStamper: {
    ...mockPackageJson.versionStamper,
    ...(overrides.versionStamper || {}),
  },
});

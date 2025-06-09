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
export const createMockPackageJson = (overrides: Partial<PackageJson> = {}): PackageJson => ({
  ...mockPackageJson,
  ...overrides,
  versionStamper: {
    ...mockPackageJson.versionStamper,
    ...(overrides.versionStamper || {}),
  },
});

describe('Package JSON Mock', () => {
  it('should create a mock package.json with default values', (): void => {
    const result = createMockPackageJson();
    expect(result).toEqual(mockPackageJson);
  });

  it('should override default values with custom values', (): void => {
    const customValues = {
      name: 'custom-app',
      version: '2.0.0',
      versionStamper: {
        buildNumber: '42',
        environment: 'production',
        lastDeployed: '2024-03-20T12:00:00.000Z',
      },
    };
    const result = createMockPackageJson(customValues);
    expect(result.name).toBe('custom-app');
    expect(result.version).toBe('2.0.0');
    expect(result.versionStamper!.buildNumber).toBe('42');
    expect(result.versionStamper!.environment).toBe('production');
    expect(result.versionStamper!.lastDeployed).toBe('2024-03-20T12:00:00.000Z');
  });

  it('should preserve default values for unspecified fields', (): void => {
    const customValues = {
      name: 'custom-app',
    };
    const result = createMockPackageJson(customValues);
    expect(result.name).toBe('custom-app');
    expect(result.version).toBe(mockPackageJson.version);
    expect(result.versionStamper).toEqual(mockPackageJson.versionStamper);
  });
});

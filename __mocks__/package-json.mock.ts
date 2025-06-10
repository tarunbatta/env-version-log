import { PackageJson } from '../src/types/packagejson';

export const mockPackageJson: PackageJson = {
  name: 'test-app',
  version: '1.0.0',
  versionTracker: {
    lastDeployed: '2024-03-20T12:00:00.000Z',
    environment: 'development',
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
export const createMockPackageJson = (overrides: Partial<PackageJson> = {}): PackageJson => {
  const versionTracker = overrides.versionTracker || mockPackageJson.versionTracker;
  return {
    ...mockPackageJson,
    ...overrides,
    versionTracker: {
      lastDeployed: versionTracker?.lastDeployed || mockPackageJson.versionTracker!.lastDeployed,
      environment: versionTracker?.environment || mockPackageJson.versionTracker!.environment,
    },
  };
};

export const createMockPackageJsonWithBuildNumber = (buildNumber: string): PackageJson => ({
  ...mockPackageJson,
  versionTracker: {
    buildNumber,
    lastDeployed: '2024-03-20T12:00:00.000Z',
    environment: 'production',
  },
});

export const verifyMockPackageJson = (result: PackageJson): void => {
  expect(result.name).toBe('test-app');
  expect(result.version).toBe('1.0.0');
  expect(result.versionTracker!.buildNumber).toBe('42');
  expect(result.versionTracker!.environment).toBe('production');
  expect(result.versionTracker!.lastDeployed).toBe('2024-03-20T12:00:00.000Z');
};

export const verifyMockPackageJsonWithOverrides = (
  result: PackageJson,
  overrides: Partial<PackageJson>
): void => {
  expect(result.name).toBe(overrides.name || mockPackageJson.name);
  expect(result.version).toBe(overrides.version || mockPackageJson.version);
  expect(result.versionTracker).toEqual(mockPackageJson.versionTracker);
};

describe('Package JSON Mock', () => {
  it('should create a mock package.json with default values', (): void => {
    const result = createMockPackageJson();
    expect(result).toEqual(mockPackageJson);
  });

  it('should override default values with custom values', (): void => {
    const customValues: Partial<PackageJson> = {
      name: 'custom-app',
      version: '2.0.0',
      versionTracker: {
        lastDeployed: '2024-03-20T12:00:00.000Z',
        environment: 'production',
      },
    };
    const result = createMockPackageJson(customValues);
    expect(result.name).toBe('custom-app');
    expect(result.version).toBe('2.0.0');
    expect(result.versionTracker!.lastDeployed).toBe('2024-03-20T12:00:00.000Z');
    expect(result.versionTracker!.environment).toBe('production');
  });

  it('should preserve default values for unspecified fields', (): void => {
    const customValues: Partial<PackageJson> = {
      name: 'custom-app',
    };
    const result = createMockPackageJson(customValues);
    expect(result.name).toBe('custom-app');
    expect(result.version).toBe(mockPackageJson.version);
    expect(result.versionTracker).toEqual(mockPackageJson.versionTracker);
  });
});

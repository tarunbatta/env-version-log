/**
 * Environment utility functions that work in both Node.js and browser environments
 */

const isNode =
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

// Type guard for import.meta
const hasImportMeta = (): boolean => {
  return typeof import.meta !== 'undefined' && import.meta !== null;
};

// Helper function to read package.json
const readPackageJson = async (
  packageJsonPath: string = '../package.json'
): Promise<{ name?: string; version?: string }> => {
  try {
    const packageJson = await import(packageJsonPath, { assert: { type: 'json' } });
    return {
      name: packageJson.name,
      version: packageJson.version,
    };
  } catch (error) {
    console.warn('Failed to read package.json:', error);
    return {};
  }
};

/**
 * Detect the current environment using multiple strategies
 * Priority:
 * 1. NODE_ENV in env file
 * 2. import.meta.env.NODE_ENV (Vite)
 * 3. Default to 'development'
 */
export const getEnvironment = (): string => {
  // 1. Check NODE_ENV in env file
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }

  // 2. Check Vite environment
  if (hasImportMeta() && import.meta.env?.NODE_ENV) {
    return import.meta.env.NODE_ENV;
  }

  // 3. Default to development
  return 'development';
};

export const getAppVersion = async (packageJsonPath?: string): Promise<string> => {
  // 1. Try package.json first
  const packageInfo = await readPackageJson(packageJsonPath);
  if (packageInfo.version) {
    return packageInfo.version;
  }

  // 2. Check environment variable
  if (process.env.APP_VERSION) {
    return process.env.APP_VERSION;
  }

  // 3. Default version
  return '0.0.0';
};

export const getAppName = async (packageJsonPath?: string): Promise<string> => {
  // 1. Try package.json first
  const packageInfo = await readPackageJson(packageJsonPath);
  if (packageInfo.name) {
    return packageInfo.name;
  }

  // 2. Check environment variable
  if (process.env.APP_NAME) {
    return process.env.APP_NAME;
  }

  // 3. Default name
  return 'Unknown App';
};

export const getCurrentWorkingDirectory = (): string => {
  if (isNode) {
    return process.cwd();
  }
  return '/';
};

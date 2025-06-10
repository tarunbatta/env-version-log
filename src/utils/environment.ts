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
  packageJsonPath: string = '../../package.json'
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
 * 1. Explicit environment variable (NODE_ENV)
 * 2. Build-time environment (import.meta.env.MODE for Vite)
 * 3. Runtime detection (hostname, URL patterns)
 * 4. Default to 'development'
 */
export const getEnvironment = (): string => {
  // 1. Check explicit environment variables
  if (isNode && process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }
  if (hasImportMeta() && import.meta.env?.NODE_ENV) {
    return import.meta.env.NODE_ENV;
  }
  if (process.env?.NODE_ENV) {
    return process.env.NODE_ENV;
  }

  // 2. Check build-time environment (Vite)
  if (hasImportMeta() && import.meta.env?.MODE) {
    return import.meta.env.MODE;
  }

  // 3. Runtime detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Common production domain patterns
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
    if (hostname.includes('staging') || hostname.includes('test')) {
      return 'staging';
    }
    if (hostname.includes('prod') || hostname.includes('production')) {
      return 'production';
    }
    // Check URL patterns
    const pathname = window.location.pathname;
    if (pathname.includes('/staging/') || pathname.includes('/test/')) {
      return 'staging';
    }
    if (pathname.includes('/prod/') || pathname.includes('/production/')) {
      return 'production';
    }
  }

  // 4. Default to development
  return 'development';
};

export const getAppVersion = async (packageJsonPath?: string): Promise<string | undefined> => {
  // Try to get from package.json first
  const packageInfo = await readPackageJson(packageJsonPath);
  if (packageInfo.version) {
    return packageInfo.version;
  }

  // Fall back to environment variables
  if (isNode) {
    return process.env.APP_VERSION;
  }
  // For browser environments, try to get from import.meta.env (Vite) or process.env (Create React App)
  if (hasImportMeta() && import.meta.env?.APP_VERSION) {
    return import.meta.env.APP_VERSION;
  }
  return process.env?.APP_VERSION;
};

export const getAppName = async (packageJsonPath?: string): Promise<string | undefined> => {
  // Try to get from package.json first
  const packageInfo = await readPackageJson(packageJsonPath);
  if (packageInfo.name) {
    return packageInfo.name;
  }

  // Fall back to environment variables
  if (isNode) {
    return process.env.APP_NAME;
  }
  // For browser environments, try to get from import.meta.env (Vite) or process.env (Create React App)
  if (hasImportMeta() && import.meta.env?.APP_NAME) {
    return import.meta.env.APP_NAME;
  }
  return process.env?.APP_NAME;
};

export const getCurrentWorkingDirectory = (): string => {
  if (isNode) {
    return process.cwd();
  }
  return '/';
};

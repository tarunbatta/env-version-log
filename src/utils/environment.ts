/**
 * Environment utility functions that work in both Node.js and browser environments
 */

const isNode =
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

export const getEnvironment = (): string => {
  if (isNode) {
    return process.env.NODE_ENV || 'development';
  }
  // For browser environments, you can use window.location.hostname or other browser-specific checks
  return 'browser';
};

export const getAppVersion = (): string | undefined => {
  if (isNode) {
    return process.env.APP_VERSION;
  }
  // For browser environments, you might want to get this from a meta tag or other source
  return undefined;
};

export const getBuildNumber = (): string | undefined => {
  if (isNode) {
    return process.env.BUILD_NUMBER;
  }
  // For browser environments, you might want to get this from a meta tag or other source
  return undefined;
};

export const getCurrentWorkingDirectory = (): string => {
  if (isNode) {
    return process.cwd();
  }
  // For browser environments, return a default or use window.location.pathname
  return '/';
};

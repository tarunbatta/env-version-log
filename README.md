# Env Version Log

A lightweight TypeScript package for tracking application versions with environment awareness.

[![npm version](https://img.shields.io/npm/v/env-version-log.svg?color=blue)](https://www.npmjs.com/package/env-version-log)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Features

- 🚀 Automatic version detection from package.json
- 🌍 Smart environment detection
- ⚡ Zero configuration needed
- 🔄 Environment variable support
- 📝 Beautiful console logging
- 🔒 TypeScript support with full type definitions
- 📦 Zero dependencies
- 🧪 Fully tested

## Installation

```bash
# Using npm
npm install env-version-log

# Using yarn
yarn add env-version-log

# Using pnpm
pnpm add env-version-log
```

## Quick Start

```typescript
import { VersionTracker } from 'env-version-log';

// Initialize with automatic detection
const tracker = await VersionTracker.initialize();

// Log version info
tracker.logVersionInfo();
```

## Automatic Detection

The package automatically detects:

1. **App Name & Version**
   - Reads from your package.json (configurable path)
   - No configuration needed
   - Falls back to environment variables if needed

2. **Environment**
   - Smart detection based on:
     - Environment variables (NODE_ENV)
     - Build-time environment (Vite's MODE)
     - Runtime context (hostname, URL patterns)
   - Common patterns:
     - Development: localhost, 127.0.0.1
     - Staging: URLs containing 'staging' or 'test'
     - Production: URLs containing 'prod' or 'production'

## Environment Variables (Optional)

You can override the automatic detection using environment variables. The package checks for variables in the following order:

### App Name
1. `name` in package.json
2. `APP_NAME` in env file
3. Default: "Unknown App"

### App Version
1. `version` in package.json
2. `APP_VERSION` in env file
3. Default: "0.0.0"

### Environment
1. `NODE_ENV` in env file
2. `import.meta.env.NODE_ENV` (Vite)
3. Default: "development"

### Configuration Options

#### 1. Using package.json
```json
{
  "name": "my-app",
  "version": "1.0.0"
}
```

#### 2. Using .env File
```env
APP_NAME=my-app
APP_VERSION=1.0.0
NODE_ENV=development
```

#### 3. Using Vite Config
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import pkg from './package.json';

export default defineConfig({
  define: {
    'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
```

> **Note**: The package will first try to read from package.json, then fall back to environment variables if package.json is not available or doesn't contain the required values.

## Browser Environment Setup

For browser environments (like React/Vite apps), you must use one of these methods:

1. **Vite Config (Recommended)**
   ```typescript
   // vite.config.ts
   import { defineConfig } from 'vite';
   import pkg from './package.json';

   export default defineConfig({
     define: {
       'import.meta.env.VITE_APP_NAME': JSON.stringify(pkg.name),
       'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
     },
   });
   ```

2. **.env File**
   ```env
   VITE_APP_NAME=my-app
   VITE_APP_VERSION=1.0.0
   ```

Then initialize the tracker without specifying `packageJsonPath`:
```typescript
// Initialize version tracker
const initVersionTracker = async () => {
  const tracker = await VersionTracker.initialize();
  tracker.logVersionInfo();
};
```

> **Note**: In browser environments, the package will use environment variables instead of trying to read `package.json`. The `packageJsonPath` option is only used in Node.js environments.

### Debugging

If you're seeing "Unknown App" or "0.0.0" version, check your browser's console for debug messages. The package will log:
- Whether it's running in a browser environment
- Available environment variables
- Values found in `import.meta.env`

This will help you identify why the values aren't being picked up correctly.

## API

### VersionTracker.initialize(config?: Partial<VersionInfo> & { packageJsonPath?: string })

Creates a new VersionTracker instance with automatic detection.

```typescript
// Automatic detection
const tracker = await VersionTracker.initialize();

// With custom config
const tracker = await VersionTracker.initialize({
  appName: 'Custom App',
  version: '2.0.0',
  environment: 'staging'
});

// With custom package.json path
const tracker = await VersionTracker.initialize({
  packageJsonPath: './custom/path/package.json'
});
```

### VersionTracker Methods

#### getVersionInfo(): VersionInfo
Returns the current version information.

```typescript
const info = tracker.getVersionInfo();
// {
//   appName: 'my-app',
//   version: '1.0.0',
//   environment: 'development',
//   lastUpdated: '2024-03-20T12:00:00.000Z'
// }
```

#### logVersionInfo(): void
Logs the current version information in a beautiful format.

```typescript
tracker.logVersionInfo();
// 📦 Application Information:
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📋 App Name: my-app
// 🔧 Environment: development
// 🔢 Version: 1.0.0
// ⏰ Last Updated: 3/20/2024, 12:00:00 PM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### checkForUpdates(): Promise<boolean>
Checks for updates from environment variables.

```typescript
const hasUpdates = await tracker.checkForUpdates();
```

### Utility Functions

#### getAppVersion(packageJsonPath?: string): Promise<string | undefined>
Gets the application version from package.json or environment variables.

```typescript
// Default package.json path
const version = await getAppVersion();

// Custom package.json path
const version = await getAppVersion('./custom/path/package.json');
```

#### getAppName(packageJsonPath?: string): Promise<string | undefined>
Gets the application name from package.json or environment variables.

```typescript
// Default package.json path
const name = await getAppName();

// Custom package.json path
const name = await getAppName('./custom/path/package.json');
```

## Browser Support

Works in both Node.js and browser environments:

- Node.js: Uses process.env
- Browser: Uses import.meta.env (Vite) or process.env (Create React App)
- Automatic environment detection based on hostname and URL patterns

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Tarun Batta](https://www.linkedin.com/in/tarunbatta/)

## Support

If you find this package helpful, please consider giving it a ⭐️ on GitHub!
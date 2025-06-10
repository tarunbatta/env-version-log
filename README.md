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

1. Vite environment variables (VITE_ prefixed)
2. Regular environment variables (non-VITE_ prefixed)
3. Default values

### Configuration Options

#### 1. Using Vite Config
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'import.meta.env.VITE_APP_NAME': JSON.stringify('Your App Name'),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify('1.0.0')
  }
});
```

#### 2. Using .env File
```env
# Vite prefixed variables (recommended)
VITE_APP_NAME=Your App Name
VITE_APP_VERSION=1.0.0

# Or regular environment variables
APP_NAME=Your App Name
APP_VERSION=1.0.0
```

#### 3. Using package.json
The package will automatically read from your package.json if available:
```json
{
  "name": "your-app-name",
  "version": "1.0.0"
}
```

Note: In browser environments, Vite prefixed variables (`VITE_APP_NAME`, `VITE_APP_VERSION`) take precedence over regular environment variables (`APP_NAME`, `APP_VERSION`). Make sure to set these variables to avoid seeing "Unknown App" in the output.

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
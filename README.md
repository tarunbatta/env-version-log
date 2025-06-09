# env-version-log

A TypeScript-friendly package for managing and tracking application versions, build numbers, and deployment information.

## Features

- 🔄 Automatic version management
- 📦 Build number tracking
- 🌍 Environment-aware logging
- ⏰ Last deployment tracking
- 📝 TypeScript support
- 🔍 Version update detection
- 🎨 Formatted console output
- 🔍 Automatic app name detection from package.json
- 🌍 Automatic environment detection from NODE_ENV

## Installation

```bash
npm install env-version-log
# or
yarn add env-version-log
# or
pnpm add env-version-log
```

## Quick Start

```typescript
import { createVersionTracker } from 'env-version-log';

// Initialize the version tracker
// App name is automatically read from package.json
// Environment is automatically read from NODE_ENV
const versionTracker = createVersionTracker();

// Log all version information in a nicely formatted way
versionTracker.logVersionInfo();
```

This will output:

```
📦 Application Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Environment: development
📋 App Name: my-app
🔢 Version: 1.0.0
🏗️  Build: 42
⏰ Last Deployed: 1/1/2024, 12:00:00 PM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## API Reference

### `createVersionTracker(config?: VersionTrackerConfig)`

Creates a new version tracker instance. Most configuration is optional as the package automatically detects:
- App name from package.json
- Environment from NODE_ENV
- Version from package.json
- Build number from package.json

```typescript
interface VersionTrackerConfig {
  appName?: string;      // Optional: Override app name from package.json
  environment?: string;  // Optional: Override NODE_ENV
  packageJsonPath?: string; // Optional: Custom path to package.json
}
```

### `versionTracker.logVersionInfo()`

Logs all version information in a formatted way to the console.

### `versionTracker.getVersionInfo()`

Returns the current version information.

### `versionTracker.incrementBuildNumber()`

Increments the build number and returns the new value.

### `versionTracker.incrementVersion(type: 'major' | 'minor' | 'patch')`

Increments the version number and returns the new value.

## Troubleshooting

### Module not found error
```typescript
// Add this to your vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      'env-version-log': 'env-version-log/dist/esm/index.js'
    }
  }
});
```

### TypeScript errors
```typescript
// Add this to your tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

## License

MIT
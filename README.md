# Env Version Log

A lightweight TypeScript package for tracking application versions and build numbers with environment awareness.

## Features

- 🚀 Simple version and build number tracking
- 🌍 Environment-aware logging
- ⚡ In-memory version management
- 🔄 Environment variable support
- 📝 Beautiful console logging

## Installation

```bash
npm install env-version-log
```

## Quick Start

```typescript
import { createVersionTracker } from 'env-version-log';

// Initialize with optional config
const tracker = await createVersionTracker({
  appName: 'My App',
  version: '1.0.0',
  buildNumber: '1',
  environment: 'development'
});

// Log version info
tracker.logVersionInfo();

// Increment version/build
tracker.incrementVersion('patch'); // Increments patch version
tracker.incrementBuildNumber();    // Increments build number

// Check for updates from env vars
await tracker.checkForUpdates();
```

## Environment Variables

The package checks for these environment variables:
- `APP_VERSION`: Overrides the version number
- `BUILD_NUMBER`: Overrides the build number
- `NODE_ENV`: Sets the environment (development/production)

## API

### createVersionTracker(config?: Partial<VersionInfo>)

Creates a new VersionTracker instance.

```typescript
const tracker = await createVersionTracker({
  appName: 'My App',
  version: '1.0.0',
  buildNumber: '1',
  environment: 'development'
});
```

### VersionTracker Methods

- `logVersionInfo()`: Logs current version information
- `getVersionInfo()`: Returns current version info
- `updateTimestamp()`: Updates the last updated timestamp
- `checkForUpdates()`: Checks for version updates from environment variables
- `incrementBuildNumber()`: Increments the build number
- `setBuildNumber(buildNumber: string)`: Sets a specific build number
- `incrementVersion(type: 'major' | 'minor' | 'patch')`: Increments version number
- `setVersion(version: string)`: Sets a specific version

## Example Output

```
📦 Application Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 App Name: My App
🔧 Environment: development
🔢 Version: 1.0.0
🏗️  Build: 1
⏰ Last Updated: 3/14/2024, 2:30:45 PM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## License

MIT
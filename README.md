# Env Version Log

A lightweight TypeScript package for tracking application versions and build numbers with environment awareness.

[![npm version](https://img.shields.io/npm/v/env-version-log.svg?color=blue)](https://www.npmjs.com/package/env-version-log)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Features

- 🚀 Simple version and build number tracking
- 🌍 Environment-aware logging
- ⚡ In-memory version management
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

## Types

```typescript
interface VersionInfo {
  appName: string;
  version: string;
  buildNumber: string;
  environment: string;
  lastUpdated?: Date;
}

type VersionType = 'major' | 'minor' | 'patch';
```

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Lint the code
npm run lint

# Format the code
npm run format
```

## License

MIT © [Tarun Batta](https://www.linkedin.com/in/tarunbatta/)

## Support

If you find this package helpful, please consider giving it a ⭐️ on GitHub!
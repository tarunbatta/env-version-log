# env-version-log

A lightweight, zero-configuration version tracking utility for JavaScript/TypeScript applications. Automatically manages version numbers and build numbers in your application.

## Features

- 🔄 Automatic version tracking
- 📦 Build number management
- 🔢 Version number management
- 🚀 CI/CD integration
- 📝 Beautiful console output
- 🔍 Version update detection
- ⚡ Zero configuration required

## Installation

```bash
npm install env-version-log
```

## Quick Start

```typescript
import { VersionTracker } from 'env-version-log';

// Initialize the tracker
const tracker = VersionTracker.initialize();

// Get current version info
const versionInfo = tracker.getVersionInfo();
console.log(versionInfo);
// Output: { appName: 'my-app', version: '1.0.0', buildNumber: '1', environment: 'development', lastDeployed: '2024-03-14T12:00:00.000Z' }

// Increment build number
const newBuildNumber = tracker.incrementBuildNumber();
console.log(newBuildNumber); // Output: '2'

// Increment version number
const newVersion = await tracker.incrementVersion('patch'); // 'major', 'minor', or 'patch'
console.log(newVersion); // Output: '1.0.1'

// Set specific version
const specificVersion = await tracker.setVersion('2.0.0');
console.log(specificVersion); // Output: '2.0.0'
```

## Version Management

Version Stamper provides flexible version management options:

### Version Sources (in order of priority)

1. Environment variable (`APP_VERSION`)
2. `package.json` version field
3. Manual configuration

### Version Increment Types

- **Major**: Increments the first number (e.g., 1.0.0 → 2.0.0)
- **Minor**: Increments the second number (e.g., 1.0.0 → 1.1.0)
- **Patch**: Increments the third number (e.g., 1.0.0 → 1.0.1)

### Version Methods

```typescript
// Increment version
await tracker.incrementVersion('patch'); // 1.0.0 → 1.0.1
await tracker.incrementVersion('minor'); // 1.0.0 → 1.1.0
await tracker.incrementVersion('major'); // 1.0.0 → 2.0.0

// Set specific version
await tracker.setVersion('2.1.3');
```

## Build Number Management

Build numbers are stored in your `package.json` file and can be managed in several ways:

### Build Number Sources (in order of priority)

1. Environment variable (`BUILD_NUMBER`)
2. `package.json` buildNumber field
3. Manual configuration

### Build Number Methods

```typescript
// Increment build number
const newBuildNumber = tracker.incrementBuildNumber();

// Set specific build number
tracker.setBuildNumber('100');
```

## Console Output

Version Stamper provides beautiful, styled console output for version information:

```typescript
// Initialize and log version info
const tracker = VersionTracker.initialize();
tracker.logVersionInfo();

// Output:
// my-app v1.0.0 (build 1) - development
// Last deployed: 3/14/2024, 12:00:00 PM
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - name: Build and Deploy
        env:
          APP_VERSION: ${{ github.ref_name }}
          BUILD_NUMBER: ${{ github.run_number }}
        run: npm run build
```

## Configuration

### Environment Variables

- `APP_VERSION`: Override the version number
- `BUILD_NUMBER`: Override the build number
- `NODE_ENV`: Set the environment (defaults to 'development')

### Custom Configuration

```typescript
const tracker = VersionTracker.initialize({
  appName: 'my-app',
  version: '1.0.0',
  buildNumber: '1',
  environment: 'production',
});
```

## API Reference

### VersionTracker

#### Static Methods

- `initialize(config?: VersionConfig, packageJsonPath?: string): VersionTracker`
- `getInstance(): VersionTracker`

#### Instance Methods

- `getVersionInfo(): VersionInfo`
- `incrementBuildNumber(): string`
- `setBuildNumber(buildNumber: string): void`
- `incrementVersion(type: 'major' | 'minor' | 'patch'): Promise<string>`
- `setVersion(version: string): Promise<string>`
- `checkForUpdates(): Promise<boolean>`
- `updateDeploymentInfo(): void`
- `logVersionInfo(): void`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

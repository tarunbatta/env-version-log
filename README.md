# Version Stamper

A lightweight, zero-configuration version tracking utility for JavaScript/TypeScript applications. Version Stamper helps you keep track of your application's version, build number, and environment information, making it easy to identify which version of your application is running in any environment.

## 🚀 Quick Start

```bash
# Install the package
npm install version-stamper

# Initialize in your application
import { VersionTracker } from 'version-stamper';

// Initialize (automatically reads from package.json)
VersionTracker.initialize();

// Log version info to console
VersionTracker.getInstance().logVersionInfo();
```

## ✨ Features

- 📦 **Zero Configuration**: Works out of the box with your package.json
- 🔄 **Automatic Version Sync**: Syncs with package.json or environment variables
- 🔢 **Build Number Management**: Multiple ways to manage build numbers
- 🕒 **Deployment Tracking**: Track when your app was last deployed
- 🔍 **Version Monitoring**: Automatically detect version updates
- 🎨 **Beautiful Console Output**: Styled version information in your console
- 📱 **Framework Agnostic**: Works with any JavaScript/TypeScript application
- 🔒 **TypeScript Support**: Full TypeScript support with type definitions

## 📖 Usage Guide

### Basic Usage

```typescript
import { VersionTracker } from 'version-stamper';

// Initialize with default settings
VersionTracker.initialize();

// Get version information
const versionInfo = VersionTracker.getInstance().getVersionInfo();
console.log(versionInfo);
// Output: {
//   appName: 'my-app',
//   version: '1.0.0',
//   buildNumber: '1',
//   environment: 'development',
//   lastDeployed: '2024-03-15T14:30:22.000Z'
// }
```

### Version Synchronization

Version Stamper automatically syncs with your package.json version, but you can also use environment variables:

```bash
# For React applications
REACT_APP_VERSION=$npm_package_version

# For other applications
VERSION=$npm_package_version
```

Version priority:

1. Environment variables (REACT_APP_VERSION or VERSION)
2. package.json version
3. Manual configuration

### Build Number Management

Choose from multiple ways to manage build numbers:

1. **Automatic Timestamp-based**:

   ```bash
   # Generate a new build number (YYYYMMDDTHHMMSSZ format)
   npm run generate-build
   ```

2. **Environment Variable**:

   ```bash
   BUILD_NUMBER=123 npm start
   ```

3. **Manual Increment**:

   ```typescript
   const newBuildNumber = VersionTracker.getInstance().incrementBuildNumber();
   ```

4. **Manual Set**:
   ```typescript
   VersionTracker.getInstance().setBuildNumber('100');
   ```

### React Integration

```typescript
import { VersionTracker } from 'version-stamper';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Initialize with environment-specific config
    VersionTracker.initialize({
      buildNumber: process.env.REACT_APP_BUILD_NUMBER || '1',
      environment: process.env.NODE_ENV
    });

    // Log version info
    VersionTracker.getInstance().logVersionInfo();

    // Check for updates every 5 minutes
    const interval = setInterval(async () => {
      const hasUpdates = await VersionTracker.getInstance().checkForUpdates();
      if (hasUpdates) {
        console.log('New version detected!');
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Your App</div>;
}
```

### CI/CD Integration

Add to your build process:

```json
{
  "scripts": {
    "prebuild": "npm run generate-build",
    "build": "your-build-command"
  }
}
```

Or in your CI/CD pipeline:

```bash
# Generate and use build number
BUILD_NUMBER=$(npm run generate-build)
npm run build
```

## 🔧 API Reference

### VersionTracker.initialize(config?: Partial<VersionInfo>, packageJsonPath?: string)

Initializes the version tracker with optional configuration.

```typescript
VersionTracker.initialize({
  appName: 'My App',
  buildNumber: '123',
  environment: 'production',
});
```

### VersionTracker.getInstance()

Returns the singleton instance.

### VersionTracker.logVersionInfo()

Logs version information to console with styling.

### VersionTracker.getVersionInfo()

Returns current version information.

### VersionTracker.updateDeploymentInfo()

Updates deployment timestamp and logs version info.

### VersionTracker.checkForUpdates()

Checks for version updates in env or package.json.

### VersionTracker.incrementBuildNumber()

Increments build number and updates package.json.

### VersionTracker.setBuildNumber(buildNumber: string)

Sets specific build number and updates package.json.

## 📝 Types

```typescript
interface VersionInfo {
  appName: string; // Application name
  version: string; // Version number
  buildNumber: string; // Build number
  environment: string; // Environment (development, production, etc.)
  lastDeployed?: string; // Last deployment timestamp
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this package in your projects!

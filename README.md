# Version Stamper

A simple version tracking utility for single-page applications. This package helps you keep track of your application's version, build number, and environment, displaying them in a nicely formatted console log. It automatically reads version information from your application's package.json and can track deployment updates.

## Installation

```bash
npm install version-stamper
```

## Usage

### Basic Usage

```typescript
import { VersionTracker } from 'version-stamper';

// Initialize the version tracker (automatically reads from package.json)
VersionTracker.initialize();

// Log version information to console
VersionTracker.getInstance().logVersionInfo();
```

### Version Synchronization

For React applications, it's recommended to use environment variables to sync the version from package.json. Add this to your `.env` file:

```bash
REACT_APP_VERSION=$npm_package_version
```

This ensures that your application's version is always in sync with your package.json version at build time. The package will automatically detect and use this environment variable.

You can also use a generic `VERSION` environment variable if you're not using React:

```bash
VERSION=$npm_package_version
```

The version priority order is:
1. Environment variable (REACT_APP_VERSION or VERSION)
2. package.json version
3. Manual configuration override

### Build Number Management

The package supports multiple ways to manage build numbers:

1. **Automatic Timestamp-based Build Numbers**:
   ```bash
   # Generate a new build number based on current timestamp
   npm run generate-build
   ```
   
   This will generate a build number in the format `YYYYMMDDTHHMMSSZ` (e.g., `20240315T143022Z`).
   The build number is automatically updated in your package.json.

2. **Environment Variable**:
   ```bash
   BUILD_NUMBER=123 npm start
   ```

3. **Manual Increment**:
   ```typescript
   // Increment build number and update package.json
   const newBuildNumber = VersionTracker.getInstance().incrementBuildNumber();
   console.log(`New build number: ${newBuildNumber}`);
   ```

4. **Manual Set**:
   ```typescript
   // Set specific build number and update package.json
   VersionTracker.getInstance().setBuildNumber('100');
   ```

### Integration with Build Process

To automatically generate build numbers during your build process, add this to your package.json:

```json
{
  "scripts": {
    "prebuild": "npm run generate-build",
    "build": "your-build-command"
  }
}
```

Or use it in your CI/CD pipeline:

```bash
# Generate build number and capture it
BUILD_NUMBER=$(npm run generate-build)
# Use the build number in your build process
npm run build
```

### Custom Configuration

```typescript
import { VersionTracker } from 'version-stamper';

// Initialize with custom configuration
VersionTracker.initialize({
  appName: 'My Awesome App',
  buildNumber: '123',
  environment: 'production'
  // version will be automatically read from package.json or environment variables
});

// Log version information to console
VersionTracker.getInstance().logVersionInfo();
```

### React Integration

```typescript
import { VersionTracker } from 'version-stamper';

// In your App.tsx or index.tsx
function App() {
  useEffect(() => {
    // Initialize with environment-specific configuration
    VersionTracker.initialize({
      buildNumber: process.env.REACT_APP_BUILD_NUMBER || '1',
      environment: process.env.NODE_ENV
    });
    
    // Log initial version info
    VersionTracker.getInstance().logVersionInfo();

    // Check for version updates periodically
    const interval = setInterval(async () => {
      const hasUpdates = await VersionTracker.getInstance().checkForUpdates();
      if (hasUpdates) {
        console.log('Application version has been updated!');
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    // Your app components
  );
}
```

### Deployment Tracking

```typescript
// After a successful deployment
VersionTracker.getInstance().updateDeploymentInfo();
```

## API

### VersionTracker.initialize(config?: Partial<VersionInfo>, packageJsonPath?: string)

Initializes the version tracker with optional configuration. If no configuration is provided, it will automatically read the app name and version from package.json or environment variables.

### VersionTracker.getInstance()

Returns the singleton instance of the version tracker.

### VersionTracker.logVersionInfo()

Logs the version information to the console in a nicely formatted way.

### VersionTracker.getVersionInfo()

Returns the current version information.

### VersionTracker.updateDeploymentInfo()

Updates the last deployment timestamp and logs the current version information.

### VersionTracker.checkForUpdates()

Checks if the version has changed (in environment variables or package.json) and updates the version information if necessary. Returns a promise that resolves to true if an update was detected.

### VersionTracker.incrementBuildNumber()

Increments the build number, updates package.json, and returns the new build number.

### VersionTracker.setBuildNumber(buildNumber: string)

Sets a specific build number and updates package.json.

## Types

```typescript
interface VersionInfo {
  appName: string;
  version: string;
  buildNumber: string;
  environment: string;
  lastDeployed?: string;
}
```

## Features

- Automatically reads version information from package.json and environment variables
- Flexible build number management:
  - Automatic timestamp-based generation
  - Cross-platform build script
  - Environment variable support
  - Manual incrementing
  - Manual setting
- Tracks deployment timestamps
- Monitors for version updates
- Beautiful console output with styling
- TypeScript support
- Environment-aware configuration
- Singleton pattern for consistent version tracking

## License

MIT 
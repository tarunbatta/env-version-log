# Version Looker

A simple version tracking utility for single-page applications. This package helps you keep track of your application's version, build number, and environment, displaying them in a nicely formatted console log.

## Installation

```bash
npm install version-looker
```

## Usage

### Basic Usage

```typescript
import { VersionTracker } from 'version-looker';

// Initialize the version tracker
VersionTracker.initialize({
  appName: 'My Awesome App',
  version: '1.0.0',
  buildNumber: '123',
  environment: 'development'
});

// Log version information to console
VersionTracker.getInstance().logVersionInfo();
```

### React Integration

```typescript
import { VersionTracker } from 'version-looker';

// In your App.tsx or index.tsx
function App() {
  useEffect(() => {
    VersionTracker.initialize({
      appName: 'My React App',
      version: '1.0.0',
      buildNumber: process.env.REACT_APP_BUILD_NUMBER || '1',
      environment: process.env.NODE_ENV
    });
    
    VersionTracker.getInstance().logVersionInfo();
  }, []);

  return (
    // Your app components
  );
}
```

## API

### VersionTracker.initialize(config: VersionInfo)

Initializes the version tracker with the provided configuration.

### VersionTracker.getInstance()

Returns the singleton instance of the version tracker.

### VersionTracker.logVersionInfo()

Logs the version information to the console in a nicely formatted way.

### VersionTracker.getVersionInfo()

Returns the current version information.

## Types

```typescript
interface VersionInfo {
  appName: string;
  version: string;
  buildNumber: string;
  environment: string;
}
```

## License

MIT 
export interface PackageJson {
  name?: string;
  version?: string;
  versionStamper?: {
    buildNumber: string;
    lastDeployed: string;
    environment: string;
  };
  description?: string;
  main?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

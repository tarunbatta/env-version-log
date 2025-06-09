export interface PackageJson {
  name: string;
  version: string;
  buildNumber?: string;
  [key: string]: unknown;
}

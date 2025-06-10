import { PackageJson } from './packagejson';

declare module '*.json' {
  const value: PackageJson;
  export default value;
}

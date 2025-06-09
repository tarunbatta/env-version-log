import * as fs from "fs";
import * as path from "path";
import { PackageJson } from "../types/packagejson";
import { Logger } from "./logger";
import {
  PackageJsonNotFoundError,
  PackageJsonReadError,
  PackageJsonWriteError,
} from "../types/errors";

/**
 * Utility class for file operations related to package.json
 */
export class FileOperations {
  /**
   * Finds the nearest package.json file in the directory tree.
   * @throws {PackageJsonNotFoundError}
   */
  static findPackageJson(): string {
    let currentDir = process.cwd();
    const maxDepth = 5; // Prevent infinite loops
    let depth = 0;

    while (depth < maxDepth) {
      const packageJsonPath = path.join(currentDir, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        return packageJsonPath;
      }
      currentDir = path.dirname(currentDir);
      depth++;
    }

    Logger.error("Could not find package.json");
    throw new PackageJsonNotFoundError();
  }

  /**
   * Reads and parses the package.json file.
   * @throws {PackageJsonReadError}
   */
  static readPackageJson(packageJsonPath: string): PackageJson {
    try {
      const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
      return JSON.parse(packageJsonContent);
    } catch (error: any) {
      Logger.error("Failed to read package.json:", error.message);
      throw new PackageJsonReadError(error.message);
    }
  }

  /**
   * Writes the package.json file.
   * @throws {PackageJsonWriteError}
   */
  static writePackageJson(packageJsonPath: string, pkg: PackageJson): void {
    try {
      fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
    } catch (error: any) {
      Logger.error("Failed to write package.json:", error.message);
      throw new PackageJsonWriteError(error.message);
    }
  }
}

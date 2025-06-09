import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';
import { PackageJson } from '../types/packagejson';
import {
  PackageJsonNotFoundError,
  PackageJsonReadError,
  PackageJsonWriteError,
} from '../types/errors';

/**
 * Utility class for file operations related to package.json
 */
export class FileOperations {
  /**
   * Finds the package.json file in the current or parent directory
   */
  public static findPackageJson(): string {
    try {
      let currentDir = process.cwd();
      while (currentDir !== path.parse(currentDir).root) {
        const packageJsonPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          return packageJsonPath;
        }
        currentDir = path.dirname(currentDir);
      }
      throw new PackageJsonNotFoundError('package.json not found');
    } catch (error) {
      Logger.error(`Error finding package.json: ${error}`);
      throw new PackageJsonNotFoundError('package.json not found');
    }
  }

  /**
   * Reads and parses the package.json file
   */
  public static async readPackageJson(filePath: string): Promise<PackageJson> {
    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      try {
        return JSON.parse(data);
      } catch (parseError: unknown) {
        if (parseError instanceof Error) {
          throw new PackageJsonReadError(`Unexpected token '${parseError.message}'`);
        }
        throw new PackageJsonReadError('Failed to parse package.json');
      }
    } catch (error) {
      if (error instanceof PackageJsonReadError) {
        throw error;
      }
      throw new PackageJsonReadError(`Failed to read package.json: ${error}`);
    }
  }

  /**
   * Writes the package.json file
   */
  public static async writePackageJson(filePath: string, data: PackageJson): Promise<void> {
    try {
      const jsonString = JSON.stringify(data, null, 2) + '\n';
      await fs.promises.writeFile(filePath, jsonString, 'utf8');
      Logger.success('Successfully wrote package.json');
    } catch (error) {
      throw new PackageJsonWriteError(`Failed to write package.json: ${error}`);
    }
  }
}

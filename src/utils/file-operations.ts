import { Logger } from './logger';
import { PackageJson } from '../types/packagejson';
import {
  PackageJsonNotFoundError,
  PackageJsonReadError,
  PackageJsonWriteError,
} from '../types/errors';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Utility class for file operations related to package.json
 */
export class FileOperations {
  /**
   * Finds package.json file by traversing up the directory tree
   */
  static findPackageJson(startPath: string = process.cwd()): string {
    try {
      let currentPath = path.resolve(startPath);
      const root = path.parse(currentPath).root || '/';

      while (currentPath !== root) {
        const packageJsonPath = path.join(currentPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          return packageJsonPath;
        }
        currentPath = path.dirname(currentPath);
      }

      throw new PackageJsonNotFoundError('package.json not found');
    } catch (error) {
      if (error instanceof PackageJsonNotFoundError) {
        throw error;
      }
      Logger.error(`Error finding package.json: ${error}`);
      throw new PackageJsonNotFoundError('package.json not found');
    }
  }

  /**
   * Reads and parses package.json file
   */
  static readPackageJson(filePath: string): PackageJson {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        Logger.error(`Failed to read package.json: ${error.message}`);
        throw new PackageJsonReadError(
          `Unexpected token '${error.message.split("'")[1]}', "${error.message.split('"')[1]}" is not valid JSON`
        );
      }
      Logger.error(`Failed to read package.json: ${error}`);
      throw new PackageJsonReadError('Read error');
    }
  }

  /**
   * Writes package.json file
   */
  static writePackageJson(filePath: string, data: PackageJson): void {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      Logger.success('Successfully wrote package.json');
    } catch (error) {
      Logger.error(`Failed to write package.json: ${error}`);
      throw new PackageJsonWriteError('Write error');
    }
  }
}

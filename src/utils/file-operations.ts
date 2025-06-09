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
 * Utility class for file operations related to package.json.
 */
export class FileOperations {
  /**
   * Finds the package.json file in the current or parent directory.
   * Throws PackageJsonNotFoundError if not found.
   */
  public static findPackageJson(): string {
    let currentDir = process.cwd();
    // Traverse up the directory tree until the root is reached
    while (currentDir !== path.parse(currentDir).root) {
      const packageJsonPath = path.join(currentDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        return packageJsonPath;
      }
      currentDir = path.dirname(currentDir);
    }
    // If the loop completes without finding the file, log and throw
    Logger.error('Error finding package.json: package.json not found in any parent directory.');
    throw new PackageJsonNotFoundError('package.json not found');
  }

  /**
   * Reads and parses the package.json file from the given path.
   * Throws PackageJsonReadError on read or parse failure.
   */
  public static async readPackageJson(filePath: string): Promise<PackageJson> {
    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      try {
        return JSON.parse(data);
      } catch (parseError: unknown) {
        // Handle JSON parsing errors specifically
        let errorMessage = 'Failed to parse package.json';
        if (parseError instanceof Error) {
          errorMessage = `Invalid JSON format in ${filePath}: ${parseError.message}`;
        }
        Logger.error(`Error parsing package.json: ${errorMessage}`);
        throw new PackageJsonReadError(errorMessage);
      }
    } catch (fileSystemError: unknown) {
      // Handle file system reading errors (e.g., file not found, permissions)
      if (fileSystemError instanceof PackageJsonReadError) {
        // If it's already a PackageJsonReadError (e.g., from inner JSON.parse catch), re-throw
        throw fileSystemError;
      }

      let errorMessage = `Failed to read file: ${filePath}`;
      if (fileSystemError instanceof Error && 'code' in fileSystemError) {
        const nodeError = fileSystemError as NodeJS.ErrnoException;
        if (nodeError.code === 'ENOENT') {
          errorMessage = `Package.json file not found at: ${filePath}`;
        } else if (nodeError.code === 'EACCES') {
          errorMessage = `Permission denied to read: ${filePath}`;
        }
        // You can add more specific Node.js error codes here if needed
      }
      Logger.error(`Error reading package.json from file system: ${errorMessage}`);
      throw new PackageJsonReadError(`Failed to read package.json: ${errorMessage}`);
    }
  }

  /**
   * Writes the package.json file with the given data to the specified path.
   * Throws PackageJsonWriteError on write failure.
   */
  public static async writePackageJson(filePath: string, data: PackageJson): Promise<void> {
    try {
      const jsonString = JSON.stringify(data, null, 2) + '\n';
      await fs.promises.writeFile(filePath, jsonString, 'utf8');
      // Include the file path in the success log for clarity
      Logger.success(`Successfully wrote package.json to ${filePath}`);
    } catch (fileSystemError: unknown) {
      // Handle file system writing errors (e.g., permissions, disk space)
      let errorMessage = `Failed to write file: ${filePath}`;
      if (fileSystemError instanceof Error && 'code' in fileSystemError) {
        const nodeError = fileSystemError as NodeJS.ErrnoException;
        if (nodeError.code === 'EACCES') {
          errorMessage = `Permission denied to write to: ${filePath}`;
        } else if (nodeError.code === 'ENOSPC') {
          errorMessage = `No space left on device for: ${filePath}`;
        }
        // You can add more specific Node.js error codes here if needed
      }
      Logger.error(`Error writing package.json to file system: ${errorMessage}`);
      throw new PackageJsonWriteError(`Failed to write package.json: ${errorMessage}`);
    }
  }
}

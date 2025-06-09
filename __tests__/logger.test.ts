import { jest } from '@jest/globals';
import { Logger } from '../src/utils/logger';

describe('Logger', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('logVersionInfo', () => {
    it('should log version information in a formatted way', () => {
      // Arrange
      const mockVersionInfo = {
        appName: 'test-app',
        version: '1.0.0',
        buildNumber: '42',
        environment: 'development',
        lastDeployed: new Date().toISOString(),
      };

      // Spy on console.log
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Act
      Logger.logVersionInfo(mockVersionInfo);

      // Assert
      expect(consoleSpy).toHaveBeenCalledTimes(8); // Header, top separator, 5 info lines, bottom separator
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('test-app'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('1.0.0'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('42'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('development'));

      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should use production emoji for production environment', () => {
      // Arrange
      const mockVersionInfo = {
        appName: 'test-app',
        version: '1.0.0',
        buildNumber: '42',
        environment: 'production',
        lastDeployed: new Date().toISOString(),
      };

      // Spy on console.log
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Act
      Logger.logVersionInfo(mockVersionInfo);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🚀'));

      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should use development emoji for non-production environment', () => {
      // Arrange
      const mockVersionInfo = {
        appName: 'test-app',
        version: '1.0.0',
        buildNumber: '42',
        environment: 'development',
        lastDeployed: new Date().toISOString(),
      };

      // Spy on console.log
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Act
      Logger.logVersionInfo(mockVersionInfo);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🔧'));

      // Cleanup
      consoleSpy.mockRestore();
    });
  });
});

import { Logger } from '../src/utils/logger';

describe('Logger', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('info', () => {
    it('should log string message with info prefix', () => {
      Logger.info('Test message');
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), 'Test message');
    });

    it('should log version info with info prefix', () => {
      const versionInfo = {
        appName: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
        environment: 'test',
        lastDeployed: '2024-01-01T00:00:00.000Z',
      };
      Logger.info(versionInfo);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('test-app')
      );
    });
  });

  describe('success', () => {
    it('should log string message with success prefix', () => {
      Logger.success('Test message');
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), 'Test message');
    });

    it('should log version info with success prefix', () => {
      const versionInfo = {
        appName: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
        environment: 'test',
        lastDeployed: '2024-01-01T00:00:00.000Z',
      };
      Logger.success(versionInfo);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('test-app')
      );
    });
  });

  describe('error', () => {
    it('should log string message with error prefix', () => {
      Logger.error('Test message');
      expect(console.error).toHaveBeenCalledWith(expect.any(String), 'Test message');
    });

    it('should log version info with error prefix', () => {
      const versionInfo = {
        appName: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
        environment: 'test',
        lastDeployed: '2024-01-01T00:00:00.000Z',
      };
      Logger.error(versionInfo);
      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('test-app')
      );
    });
  });

  describe('warn', () => {
    it('should log string message with warning prefix', () => {
      Logger.warn('Test message');
      expect(console.warn).toHaveBeenCalledWith(expect.any(String), 'Test message');
    });

    it('should log version info with warning prefix', () => {
      const versionInfo = {
        appName: 'test-app',
        version: '1.0.0',
        buildNumber: '1',
        environment: 'test',
        lastDeployed: '2024-01-01T00:00:00.000Z',
      };
      Logger.warn(versionInfo);
      expect(console.warn).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('test-app')
      );
    });
  });

  describe('formatVersionInfo', () => {
    it('should handle partial version info', () => {
      const versionInfo = {
        appName: undefined,
        version: undefined,
        buildNumber: '1',
        environment: 'test',
        lastDeployed: undefined,
      };
      Logger.info(versionInfo);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('#1'));
    });
  });
});

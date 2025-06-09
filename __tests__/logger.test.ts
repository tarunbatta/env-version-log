import { Logger } from '../src/utils/logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should log info messages', () => {
    Logger.info('Test message', { data: 'test' });
    expect(consoleLogSpy).toHaveBeenCalledWith('[INFO]', 'Test message', { data: 'test' });
  });

  it('should log warning messages', () => {
    Logger.warn('Test warning', { data: 'test' });
    expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', 'Test warning', { data: 'test' });
  });

  it('should log error messages', () => {
    Logger.error('Test error', { data: 'test' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'Test error', { data: 'test' });
  });

  it('should handle multiple arguments', () => {
    Logger.info('Message', 'arg1', 'arg2', { data: 'test' });
    expect(consoleLogSpy).toHaveBeenCalledWith('[INFO]', 'Message', 'arg1', 'arg2', {
      data: 'test',
    });
  });

  it('should handle no arguments', () => {
    Logger.info('Message');
    expect(consoleLogSpy).toHaveBeenCalledWith('[INFO]', 'Message');
  });
});

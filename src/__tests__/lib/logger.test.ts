import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '@/lib/logger';

describe('logger', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv('NODE_ENV', originalEnv!);
  });

  describe('development mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development');
    });

    it('logs info with level prefix', () => {
      logger.info('test message');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] test message')
      );
    });

    it('logs warn with level prefix', () => {
      logger.warn('warning message');
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] warning message')
      );
    });

    it('logs error with level prefix', () => {
      logger.error('error message');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] error message')
      );
    });

    it('includes context in dev output', () => {
      logger.info('test', { userId: '123' });
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('"userId":"123"')
      );
    });

    it('includes error details with stack in dev', () => {
      const err = new Error('something broke');
      logger.error('failed', err);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('something broke')
      );
    });
  });

  describe('production mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production');
    });

    it('outputs structured JSON for info', () => {
      logger.info('deploy started', { version: '1.0' });
      const call = (console.log as ReturnType<typeof vi.fn>).mock.calls[0][0];
      const parsed = JSON.parse(call);
      expect(parsed.level).toBe('info');
      expect(parsed.message).toBe('deploy started');
      expect(parsed.version).toBe('1.0');
      expect(parsed.timestamp).toBeDefined();
    });

    it('outputs structured JSON for error', () => {
      const err = new Error('db timeout');
      logger.error('query failed', err);
      const call = (console.error as ReturnType<typeof vi.fn>).mock.calls[0][0];
      const parsed = JSON.parse(call);
      expect(parsed.level).toBe('error');
      expect(parsed.errorMessage).toBe('db timeout');
      expect(parsed.errorName).toBe('Error');
      expect(parsed.stack).toBeUndefined(); // stack excluded in production
    });

    it('outputs structured JSON for warn', () => {
      logger.warn('slow query', { duration: 5000 });
      const call = (console.warn as ReturnType<typeof vi.fn>).mock.calls[0][0];
      const parsed = JSON.parse(call);
      expect(parsed.level).toBe('warn');
      expect(parsed.duration).toBe(5000);
    });
  });
});

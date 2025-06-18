import pino from 'pino';

/**
 * Production-ready logger with beautiful development experience
 *
 * Features:
 * - Colored, pretty logs in development
 * - Structured JSON logs in production
 * - Proper log levels (debug, info, warn, error)
 * - Zero performance impact in production
 */
const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
            messageFormat: '{levelLabel} - {msg}',
          },
        }
      : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
});

/**
 * Structured logging helpers for common use cases
 */
export const log = {
  // API request/response logging
  api: {
    request: (method: string, path: string, userId?: string) =>
      logger.info({ method, path, userId }, `API ${method} ${path}`),

    response: (method: string, path: string, status: number, duration?: number) =>
      logger.info({ method, path, status, duration }, `API ${method} ${path} - ${status}`),

    error: (method: string, path: string, error: Error, userId?: string) =>
      logger.error(
        { method, path, error: error.message, stack: error.stack, userId },
        `API ${method} ${path} - ERROR: ${error.message}`
      ),
  },

  // User action logging
  user: {
    action: (userId: string, action: string, metadata?: Record<string, any>) =>
      logger.info({ userId, action, ...metadata }, `User ${userId} - ${action}`),

    error: (userId: string, action: string, error: Error) =>
      logger.error(
        { userId, action, error: error.message },
        `User ${userId} - ${action} failed: ${error.message}`
      ),
  },

  // Image/file operations
  image: {
    upload: (userId: string, filename: string, size: number, type: string) =>
      logger.info({ userId, filename, size, type }, `Image uploaded: ${filename}`),

    process: (userId: string, filename: string, operation: string) =>
      logger.info({ userId, filename, operation }, `Image processing: ${operation}`),

    error: (userId: string, filename: string, error: Error) =>
      logger.error(
        { userId, filename, error: error.message },
        `Image operation failed: ${error.message}`
      ),
  },

  // General application logging
  app: {
    start: () => logger.info('Application started'),

    config: (config: Record<string, any>) => logger.debug({ config }, 'Application configuration'),

    performance: (operation: string, duration: number, metadata?: Record<string, any>) =>
      logger.debug(
        { operation, duration, ...metadata },
        `Performance: ${operation} took ${duration}ms`
      ),
  },
};

export default logger;

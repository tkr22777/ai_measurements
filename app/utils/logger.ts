import pino from 'pino';

/**
 * Next.js-compatible logger with beautiful development experience
 * Avoids worker threads that can cause issues in Next.js
 */

// Custom pretty formatter for development
const prettyPrint = (obj: any) => {
  const timestamp = new Date().toLocaleTimeString();
  const level =
    obj.level === 30 ? 'INFO' : obj.level === 40 ? 'WARN' : obj.level === 50 ? 'ERROR' : 'DEBUG';
  const levelColor =
    obj.level === 30
      ? '\x1b[32m'
      : obj.level === 40
        ? '\x1b[33m'
        : obj.level === 50
          ? '\x1b[31m'
          : '\x1b[36m';
  const reset = '\x1b[0m';

  console.log(`${levelColor}${level}${reset} ${timestamp} - ${obj.msg}`);

  // Show additional context if available
  const context = { ...obj };
  delete context.level;
  delete context.time;
  delete context.msg;
  delete context.pid;
  delete context.hostname;

  if (Object.keys(context).length > 0) {
    console.log('  Context:', JSON.stringify(context, null, 2));
  }
};

const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  ...(process.env.NODE_ENV === 'development' && {
    write: prettyPrint,
  }),
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

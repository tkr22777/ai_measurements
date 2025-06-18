/**
 * Lightweight, Next.js-compatible logger
 * Zero dependencies, no punycode warnings
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class SimpleLogger {
  private isDev = process.env.NODE_ENV === 'development';

  private getColor(level: LogLevel): string {
    switch (level) {
      case 'debug':
        return '\x1b[36m'; // Cyan
      case 'info':
        return '\x1b[32m'; // Green
      case 'warn':
        return '\x1b[33m'; // Yellow
      case 'error':
        return '\x1b[31m'; // Red
      default:
        return '\x1b[0m';
    }
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toLocaleTimeString();
    const levelUpper = level.toUpperCase();

    if (this.isDev) {
      // Colored output for development
      const color = this.getColor(level);
      const reset = '\x1b[0m';

      console.log(`${color}${levelUpper}${reset} ${timestamp} - ${message}`);

      if (context && Object.keys(context).length > 0) {
        console.log('  Context:', JSON.stringify(context, null, 2));
      }
    } else {
      // JSON output for production
      const logObj = {
        level,
        time: new Date().toISOString(),
        msg: message,
        ...context,
      };
      console.log(JSON.stringify(logObj));
    }
  }

  debug(context: LogContext, message: string): void {
    this.formatMessage('debug', message, context);
  }

  info(context: LogContext, message: string): void {
    this.formatMessage('info', message, context);
  }

  warn(context: LogContext, message: string): void {
    this.formatMessage('warn', message, context);
  }

  error(context: LogContext, message: string): void {
    this.formatMessage('error', message, context);
  }
}

const logger = new SimpleLogger();

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
    action: (userId: string, action: string, metadata?: Record<string, unknown>) =>
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
    start: () => logger.info({}, 'Application started'),

    config: (config: Record<string, unknown>) =>
      logger.debug({ config }, 'Application configuration'),

    performance: (operation: string, duration: number, metadata?: Record<string, unknown>) =>
      logger.debug(
        { operation, duration, ...metadata },
        `Performance: ${operation} took ${duration}ms`
      ),
  },
};

export default logger;

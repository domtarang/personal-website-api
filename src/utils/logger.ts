import util from 'node:util';
import env from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

type LogContext = Record<string, unknown>;

interface ErrorContext {
  name: string;
  message: string;
  stack?: string;
}

const LOG_LEVEL_RANK: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 50,
};

const coerceLogLevel = (value: string): LogLevel => {
  const normalized = value.trim().toLowerCase();

  if (normalized === 'debug' || normalized === 'info' || normalized === 'warn' || normalized === 'error' || normalized === 'silent') {
    return normalized;
  }

  return 'info';
};

const activeLevel = env.nodeEnv === 'test' ? 'silent' : coerceLogLevel(env.logLevel);

const serializeError = (error: Error): ErrorContext => {
  const payload: ErrorContext = {
    name: error.name,
    message: error.message,
  };

  if (error.stack) {
    payload.stack = error.stack;
  }

  return payload;
};

const normalizeContext = (context: LogContext): LogContext => {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => {
      if (value instanceof Error) {
        return [key, serializeError(value)];
      }

      return [key, value];
    }),
  );
};

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVEL_RANK[level] >= LOG_LEVEL_RANK[activeLevel];
};

const writeLog = (level: Exclude<LogLevel, 'silent'>, message: string, context: LogContext = {}): void => {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...normalizeContext(context),
  };

  const line = JSON.stringify(payload, null, env.isProduction ? 0 : 2);

  switch (level) {
    case 'debug':
    case 'info':
      console.log(line);
      return;
    case 'warn':
      console.warn(line);
      return;
    case 'error':
      console.error(line);
      return;
    default:
      console.log(util.inspect(payload));
  }
};

const logger = {
  debug(message: string, context?: LogContext): void {
    writeLog('debug', message, context);
  },
  info(message: string, context?: LogContext): void {
    writeLog('info', message, context);
  },
  warn(message: string, context?: LogContext): void {
    writeLog('warn', message, context);
  },
  error(message: string, context?: LogContext): void {
    writeLog('error', message, context);
  },
};

export default logger;

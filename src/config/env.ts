import dotenv from 'dotenv';

dotenv.config();

const LOCAL_DEV_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
] as const;

type AllowedOrigins = '*' | string[];

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
};

const parseOrigins = (value: string | undefined, isProduction: boolean): AllowedOrigins => {
  if (!value?.trim()) {
    return isProduction ? [] : [...LOCAL_DEV_ORIGINS];
  }

  const normalized = value.trim();

  if (normalized === '*') {
    return '*';
  }

  return normalized
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export interface Env {
  nodeEnv: string;
  isProduction: boolean;
  logLevel: string;
  port: number;
  databaseUrl: string;
  adminBootstrapUsername: string;
  adminBootstrapPassword: string;
  authSessionDays: number;
  authSessionMs: number;
  corsAllowedOrigins: AllowedOrigins;
  requestBodyLimit: string;
  trustProxy: boolean;
  sessionPruneIntervalMinutes: number;
  sessionPruneIntervalMs: number;
  authRateLimitWindowMs: number;
  authRateLimitMax: number;
  gracefulShutdownTimeoutMs: number;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';
const authSessionDays = toNumber(process.env.AUTH_SESSION_DAYS, 30);
const sessionPruneIntervalMinutes = toNumber(process.env.SESSION_PRUNE_INTERVAL_MINUTES, 30);
const authRateLimitWindowMs = toNumber(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000);

const env: Env = {
  nodeEnv,
  isProduction,
  logLevel: (process.env.LOG_LEVEL ?? 'info').trim() || 'info',
  port: toNumber(process.env.PORT, 3000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  adminBootstrapUsername: (process.env.ADMIN_BOOTSTRAP_USERNAME ?? 'admin').trim() || 'admin',
  adminBootstrapPassword: (process.env.ADMIN_BOOTSTRAP_PASSWORD ?? '').trim(),
  authSessionDays,
  authSessionMs: authSessionDays * 24 * 60 * 60 * 1000,
  corsAllowedOrigins: parseOrigins(process.env.CORS_ALLOWED_ORIGINS, isProduction),
  requestBodyLimit: (process.env.REQUEST_BODY_LIMIT ?? '100kb').trim() || '100kb',
  trustProxy: toBoolean(process.env.TRUST_PROXY, false),
  sessionPruneIntervalMinutes,
  sessionPruneIntervalMs: sessionPruneIntervalMinutes * 60 * 1000,
  authRateLimitWindowMs,
  authRateLimitMax: toNumber(process.env.AUTH_RATE_LIMIT_MAX, 5),
  gracefulShutdownTimeoutMs: toNumber(process.env.GRACEFUL_SHUTDOWN_TIMEOUT_MS, 10000),
};

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is not set. Add it to your .env file before starting the API.');
}

if (env.isProduction && env.corsAllowedOrigins !== '*' && env.corsAllowedOrigins.length === 0) {
  throw new Error(
    'CORS_ALLOWED_ORIGINS must be set in production. Example: https://domtarang.com,https://www.domtarang.com',
  );
}

export default env;

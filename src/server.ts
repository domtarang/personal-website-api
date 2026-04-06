import http, { type Server } from 'node:http';
import app from './app';
import env from './config/env';
import { closePool } from './config/database';
import * as adminService from './services/admin.service';
import * as sessionMaintenanceService from './services/session-maintenance.service';
import * as migrationService from './services/migration.service';
import logger from './utils/logger';

const server: Server = http.createServer(app);
let isShuttingDown = false;
let shutdownTimer: NodeJS.Timeout | null = null;

const listen = async (): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error): void => {
      server.off('listening', onListening);
      reject(error);
    };

    const onListening = (): void => {
      server.off('error', onError);
      resolve();
    };

    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(env.port);
  });
};

const startServer = async (): Promise<void> => {
  const migrationResult = await migrationService.migrateDatabase();
  const bootstrapResult = await adminService.bootstrapInitialAdmin();
  await sessionMaintenanceService.pruneExpiredSessions({ force: true });
  await listen();

  logger.info('Server started.', {
    port: env.port,
    nodeEnv: env.nodeEnv,
    appliedMigrations: migrationResult.appliedCount,
    totalMigrations: migrationResult.totalCount,
  });

  if (bootstrapResult.bootstrapped) {
    logger.warn('Bootstrapped initial admin user from environment variables.', {
      username: bootstrapResult.username,
    });
  }
};

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info('Shutdown signal received.', { signal });

  shutdownTimer = setTimeout(() => {
    logger.error('Forced shutdown after timeout.', { timeoutMs: env.gracefulShutdownTimeoutMs });
    process.exit(1);
  }, env.gracefulShutdownTimeoutMs);

  shutdownTimer.unref();

  server.close(async () => {
    try {
      await closePool();

      if (shutdownTimer) {
        clearTimeout(shutdownTimer);
      }

      logger.info('Server shutdown completed successfully.');
      process.exit(0);
    } catch (error) {
      logger.error('Failed to close database pool cleanly.', { error });
      process.exit(1);
    }
  });
};

void startServer().catch((error: unknown) => {
  logger.error('Failed to start server.', { error });
  process.exit(1);
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

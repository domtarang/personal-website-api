import { closePool } from '../config/database';
import { getMigrationStatus, migrateDatabase } from '../services/migration.service';
import logger from '../utils/logger';

const printStatus = async (): Promise<void> => {
  const status = await getMigrationStatus();

  if (status.length === 0) {
    logger.info('No migration files were found.', {});
    return;
  }

  for (const migration of status) {
    logger.info('Migration status.', {
      migrationName: migration.name,
      applied: migration.isApplied,
      appliedAt: migration.appliedAt,
    });
  }
};

const run = async (): Promise<void> => {
  const command = process.argv[2] ?? 'up';

  if (command === 'status') {
    await printStatus();
    return;
  }

  if (command === 'up') {
    const result = await migrateDatabase();

    logger.info('Database migration run completed.', {
      appliedCount: result.appliedCount,
      appliedNames: result.appliedNames,
      pendingCount: result.pendingCount,
      totalCount: result.totalCount,
    });
    return;
  }

  throw new Error(`Unknown migration command: ${command}. Use "up" or "status".`);
};

void run()
  .catch((error: unknown) => {
    logger.error('Migration command failed.', { error });
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });

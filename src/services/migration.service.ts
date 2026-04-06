import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { type QueryResultRow } from 'pg';
import { query, withTransaction } from '../config/database';
import type { AppliedMigration, MigrationFile, MigrationRecord, MigrationRunResult } from '../types/migration';
import logger from '../utils/logger';
import { resolveProjectPath } from '../utils/project-paths';

const MIGRATION_TABLE_NAME = 'schema_migrations';
const MIGRATIONS_DIRECTORY = resolveProjectPath('migrations');

interface AppliedMigrationRow extends QueryResultRow {
  name: string;
  checksum: string;
  applied_at: string;
}

const compareMigrationNames = (left: string, right: string): number => left.localeCompare(right);

const createChecksum = (sql: string): string => {
  return crypto.createHash('sha256').update(sql, 'utf8').digest('hex');
};

const readMigrationFiles = async (): Promise<MigrationFile[]> => {
  const directoryEntries = await fs.readdir(MIGRATIONS_DIRECTORY, { withFileTypes: true });

  const migrationNames = directoryEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => entry.name)
    .sort(compareMigrationNames);

  const migrations = await Promise.all(
    migrationNames.map(async (name) => {
      const absolutePath = path.join(MIGRATIONS_DIRECTORY, name);
      const sql = await fs.readFile(absolutePath, 'utf8');

      return {
        name,
        absolutePath,
        checksum: createChecksum(sql),
        sql,
      } satisfies MigrationFile;
    }),
  );

  return migrations;
};

const ensureMigrationTable = async (): Promise<void> => {
  await query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE_NAME} (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const readAppliedMigrations = async (): Promise<AppliedMigration[]> => {
  const result = await query<AppliedMigrationRow>(
    `
      SELECT name, checksum, applied_at::text
      FROM ${MIGRATION_TABLE_NAME}
      ORDER BY name ASC
    `,
  );

  return result.rows;
};

const assertNoChecksumDrift = (
  migrationFiles: MigrationFile[],
  appliedMigrations: AppliedMigration[],
): void => {
  const appliedByName = new Map(appliedMigrations.map((migration) => [migration.name, migration]));

  for (const migrationFile of migrationFiles) {
    const appliedMigration = appliedByName.get(migrationFile.name);

    if (!appliedMigration) {
      continue;
    }

    if (appliedMigration.checksum !== migrationFile.checksum) {
      throw new Error(
        `Applied migration checksum mismatch for ${migrationFile.name}. ` +
          'Create a new migration instead of editing an already-applied file.',
      );
    }
  }
};

export const getMigrationStatus = async (): Promise<MigrationRecord[]> => {
  await ensureMigrationTable();

  const [migrationFiles, appliedMigrations] = await Promise.all([
    readMigrationFiles(),
    readAppliedMigrations(),
  ]);

  assertNoChecksumDrift(migrationFiles, appliedMigrations);

  const appliedByName = new Map(appliedMigrations.map((migration) => [migration.name, migration]));

  return migrationFiles.map((migrationFile) => {
    const appliedMigration = appliedByName.get(migrationFile.name);

    return {
      name: migrationFile.name,
      checksum: migrationFile.checksum,
      appliedAt: appliedMigration?.applied_at ?? null,
      isApplied: Boolean(appliedMigration),
    } satisfies MigrationRecord;
  });
};

export const migrateDatabase = async (): Promise<MigrationRunResult> => {
  await ensureMigrationTable();

  const migrationFiles = await readMigrationFiles();
  const appliedMigrations = await readAppliedMigrations();
  assertNoChecksumDrift(migrationFiles, appliedMigrations);

  const appliedMigrationNames = new Set(appliedMigrations.map((migration) => migration.name));
  const pendingMigrations = migrationFiles.filter((migration) => !appliedMigrationNames.has(migration.name));
  const appliedNames: string[] = [];

  for (const migration of pendingMigrations) {
    await withTransaction(async (client) => {
      await client.query(migration.sql);
      await client.query(
        `
          INSERT INTO ${MIGRATION_TABLE_NAME} (name, checksum)
          VALUES ($1, $2)
        `,
        [migration.name, migration.checksum],
      );
    });

    appliedNames.push(migration.name);
    logger.info('Applied database migration.', {
      migrationName: migration.name,
    });
  }

  return {
    appliedCount: appliedNames.length,
    appliedNames,
    pendingCount: pendingMigrations.length - appliedNames.length,
    totalCount: migrationFiles.length,
  };
};

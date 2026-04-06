import fs from 'node:fs/promises';
import path from 'node:path';
import { resolveProjectPath } from '../utils/project-paths';

const MIGRATIONS_DIRECTORY = resolveProjectPath('migrations');

const normalizeMigrationName = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

const createTimestampPrefix = (): string => {
  const now = new Date();
  const parts = [
    now.getUTCFullYear(),
    `${now.getUTCMonth() + 1}`.padStart(2, '0'),
    `${now.getUTCDate()}`.padStart(2, '0'),
    `${now.getUTCHours()}`.padStart(2, '0'),
    `${now.getUTCMinutes()}`.padStart(2, '0'),
    `${now.getUTCSeconds()}`.padStart(2, '0'),
  ];

  return parts.join('');
};

const run = async (): Promise<void> => {
  const rawName = process.argv.slice(2).join(' ');
  const normalizedName = normalizeMigrationName(rawName);

  if (!normalizedName) {
    throw new Error('Provide a migration name. Example: npm run migrate:create -- add_admin_indexes');
  }

  await fs.mkdir(MIGRATIONS_DIRECTORY, { recursive: true });

  const fileName = `${createTimestampPrefix()}_${normalizedName}.sql`;
  const filePath = path.join(MIGRATIONS_DIRECTORY, fileName);

  await fs.writeFile(
    filePath,
    '-- Write forward-only SQL here. Avoid editing applied migration files.\n',
    'utf8',
  );

  process.stdout.write(`${fileName}\n`);
};

void run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  process.stderr.write(`${message}\n`);
  process.exit(1);
});

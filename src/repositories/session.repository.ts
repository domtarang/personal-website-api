import { query } from '../config/database';
import type { AdminSessionRecord } from '../types/auth';
import type { QueryRunner } from '../types/database';

const defaultRunner: QueryRunner = { query };

interface CreateSessionPayload {
  tokenHash: string;
  expiresAt: string;
}

export const pruneExpiredSessions = async (runner: QueryRunner = defaultRunner): Promise<void> => {
  await runner.query('DELETE FROM admin_sessions WHERE expires_at <= NOW()');
};

export const createSession = async (
  payload: CreateSessionPayload,
  runner: QueryRunner = defaultRunner,
): Promise<AdminSessionRecord> => {
  const result = await runner.query<AdminSessionRecord>(
    `INSERT INTO admin_sessions (token_hash, expires_at)
     VALUES ($1, $2)
     RETURNING id, expires_at`,
    [payload.tokenHash, payload.expiresAt],
  );

  return result.rows[0] as AdminSessionRecord;
};

export const touchValidSession = async (
  tokenHash: string,
  runner: QueryRunner = defaultRunner,
): Promise<AdminSessionRecord | null> => {
  const result = await runner.query<AdminSessionRecord>(
    `UPDATE admin_sessions
     SET last_used_at = NOW()
     WHERE token_hash = $1
       AND expires_at > NOW()
     RETURNING id, expires_at`,
    [tokenHash],
  );

  return result.rows[0] ?? null;
};

export const deleteSessionByTokenHash = async (
  tokenHash: string,
  runner: QueryRunner = defaultRunner,
): Promise<void> => {
  await runner.query('DELETE FROM admin_sessions WHERE token_hash = $1', [tokenHash]);
};

export const deleteAllSessions = async (runner: QueryRunner = defaultRunner): Promise<void> => {
  await runner.query('DELETE FROM admin_sessions');
};

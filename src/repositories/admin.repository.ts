import { query } from '../config/database';
import type { AdminSummary, AdminUserRecord } from '../types/auth';
import type { QueryRunner } from '../types/database';

const defaultRunner: QueryRunner = { query };

interface UpdatePasswordPayload {
  adminId: number;
  passwordSalt: string;
  passwordHash: string;
}

interface InsertAdminPayload {
  username: string;
  passwordSalt: string;
  passwordHash: string;
}

export const findActiveAdmin = async (
  runner: QueryRunner = defaultRunner,
): Promise<AdminUserRecord | null> => {
  const result = await runner.query<AdminUserRecord>(
    `SELECT id, username, password_salt, password_hash, is_active, last_login_at, updated_at
     FROM admin_users
     WHERE is_active = TRUE
     ORDER BY id ASC
     LIMIT 1`,
  );

  return result.rows[0] ?? null;
};

export const insertAdmin = async (
  payload: InsertAdminPayload,
  runner: QueryRunner = defaultRunner,
): Promise<AdminSummary> => {
  const result = await runner.query<AdminSummary>(
    `INSERT INTO admin_users (username, password_salt, password_hash, is_active)
     VALUES ($1, $2, $3, TRUE)
     RETURNING id, username`,
    [payload.username, payload.passwordSalt, payload.passwordHash],
  );

  return result.rows[0] as AdminSummary;
};

export const updateAdminLastLogin = async (
  adminId: number,
  runner: QueryRunner = defaultRunner,
): Promise<void> => {
  await runner.query(
    `UPDATE admin_users
     SET last_login_at = NOW()
     WHERE id = $1`,
    [adminId],
  );
};

export const updateAdminPasswordHash = async (
  payload: UpdatePasswordPayload,
  runner: QueryRunner = defaultRunner,
): Promise<void> => {
  await runner.query(
    `UPDATE admin_users
     SET password_salt = $1,
         password_hash = $2,
         updated_at = NOW()
     WHERE id = $3`,
    [payload.passwordSalt, payload.passwordHash, payload.adminId],
  );
};

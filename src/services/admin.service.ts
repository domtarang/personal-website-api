import { withTransaction } from '../config/database';
import env from '../config/env';
import HttpError from '../utils/http-error';
import { createPasswordHash, verifyPassword } from '../utils/password';
import * as adminRepository from '../repositories/admin.repository';
import * as sessionRepository from '../repositories/session.repository';
import type { AdminUserRecord, PasswordUpdateBody } from '../types/auth';
import type { QueryRunner } from '../types/database';

interface BootstrapResult {
  bootstrapped: boolean;
  username: string;
}

export const bootstrapInitialAdmin = async (): Promise<BootstrapResult> => {
  return withTransaction(async (client) => {
    const existingAdmin = await adminRepository.findActiveAdmin(client);

    if (existingAdmin) {
      return {
        bootstrapped: false,
        username: existingAdmin.username,
      };
    }

    if (!env.adminBootstrapPassword) {
      throw new Error(
        'No active admin user exists. Set ADMIN_BOOTSTRAP_PASSWORD in .env to create the first admin account.',
      );
    }

    const credentials = await createPasswordHash(env.adminBootstrapPassword);

    const admin = await adminRepository.insertAdmin(
      {
        username: env.adminBootstrapUsername,
        passwordSalt: credentials.salt,
        passwordHash: credentials.hash,
      },
      client,
    );

    return {
      bootstrapped: true,
      username: admin.username,
    };
  });
};

export const readActiveAdmin = async (): Promise<AdminUserRecord | null> => {
  return adminRepository.findActiveAdmin();
};

export const verifyAdminPassword = async (password: string): Promise<AdminUserRecord> => {
  const admin = await adminRepository.findActiveAdmin();

  if (!admin) {
    throw HttpError.unauthorized('Invalid password.');
  }

  const isValid = await verifyPassword(password, admin.password_salt, admin.password_hash);

  if (!isValid) {
    throw HttpError.unauthorized('Invalid password.');
  }

  return admin;
};

export const touchAdminLastLogin = async (
  adminId: number,
  runner: QueryRunner,
): Promise<void> => adminRepository.updateAdminLastLogin(adminId, runner);

export const updatePassword = async ({
  currentPassword,
  newPassword,
}: PasswordUpdateBody): Promise<void> => {
  return withTransaction(async (client) => {
    const admin = await adminRepository.findActiveAdmin(client);

    if (!admin) {
      throw HttpError.badRequest('Admin user not found.');
    }

    const matchesCurrent = await verifyPassword(currentPassword, admin.password_salt, admin.password_hash);

    if (!matchesCurrent) {
      throw HttpError.badRequest('Current password is incorrect.');
    }

    const credentials = await createPasswordHash(newPassword);

    await adminRepository.updateAdminPasswordHash(
      {
        adminId: admin.id,
        passwordSalt: credentials.salt,
        passwordHash: credentials.hash,
      },
      client,
    );

    await sessionRepository.deleteAllSessions(client);
  });
};

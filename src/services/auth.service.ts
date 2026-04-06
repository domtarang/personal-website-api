import env from '../config/env';
import { withTransaction } from '../config/database';
import * as sessionRepository from '../repositories/session.repository';
import * as sessionMaintenanceService from './session-maintenance.service';
import * as adminService from './admin.service';
import { generateSessionToken, getBearerToken, hashToken } from '../utils/token';
import type { AuthenticatedSession, LoginResponse } from '../types/auth';

const toIsoString = (value: string | Date): string =>
  value instanceof Date ? value.toISOString() : new Date(value).toISOString();

export const login = async (password: string): Promise<LoginResponse> => {
  const admin = await adminService.verifyAdminPassword(password);
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + env.authSessionMs).toISOString();

  await withTransaction(async (client) => {
    await adminService.touchAdminLastLogin(admin.id, client);
    await sessionRepository.createSession({ tokenHash: hashToken(token), expiresAt }, client);
  });

  await sessionMaintenanceService.pruneExpiredSessions();

  return {
    token,
    expiresAt,
  };
};

export const verifySession = async (
  authorizationHeader: string,
): Promise<AuthenticatedSession | null> => {
  const token = getBearerToken(authorizationHeader);

  if (!token) {
    return null;
  }

  const session = await sessionRepository.touchValidSession(hashToken(token));

  if (!session) {
    return null;
  }

  return {
    token,
    sessionId: session.id,
    expiresAt: toIsoString(session.expires_at),
  };
};

export const logout = async (authorizationHeader: string): Promise<void> => {
  const token = getBearerToken(authorizationHeader);

  if (!token) {
    return;
  }

  await sessionRepository.deleteSessionByTokenHash(hashToken(token));
};

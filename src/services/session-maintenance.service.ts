import env from '../config/env';
import * as sessionRepository from '../repositories/session.repository';

let lastPrunedAt = 0;

export const pruneExpiredSessions = async ({ force = false }: { force?: boolean } = {}): Promise<boolean> => {
  const now = Date.now();

  if (!force && now - lastPrunedAt < env.sessionPruneIntervalMs) {
    return false;
  }

  await sessionRepository.pruneExpiredSessions();
  lastPrunedAt = now;

  return true;
};

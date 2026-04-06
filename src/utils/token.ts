import { createHash, randomBytes } from 'node:crypto';

export const getBearerToken = (authorizationHeader = ''): string => {
  if (!authorizationHeader.startsWith('Bearer ')) {
    return '';
  }

  return authorizationHeader.slice('Bearer '.length).trim();
};

export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};

export const generateSessionToken = (): string => randomBytes(32).toString('hex');

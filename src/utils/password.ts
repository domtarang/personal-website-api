import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { PasswordHash } from '../types/auth';

const scryptAsync = promisify(scrypt);
const PASSWORD_HASH_BYTES = 64;

const safeEquals = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left, 'utf8');
  const rightBuffer = Buffer.from(right, 'utf8');

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const createPasswordHash = async (
  password: string,
  salt = randomBytes(16).toString('hex'),
): Promise<PasswordHash> => {
  const derivedKey = (await scryptAsync(password, salt, PASSWORD_HASH_BYTES)) as Buffer;
  const hash = derivedKey.toString('hex');

  return { salt, hash };
};

export const verifyPassword = async (
  password: string,
  salt: string,
  expectedHash: string,
): Promise<boolean> => {
  if (!salt || !expectedHash) {
    return false;
  }

  const derivedKey = (await scryptAsync(password, salt, PASSWORD_HASH_BYTES)) as Buffer;
  const actualHash = derivedKey.toString('hex');
  return safeEquals(actualHash, expectedHash);
};

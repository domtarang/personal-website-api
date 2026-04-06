import type { LoginBody, PasswordUpdateBody } from '../types/auth';
import type { ValidationError, ValidationResult } from '../types/validation';

const MAX_PASSWORD_LENGTH = 256;

const createValidationResult = <T>(value: T, errors: ValidationError[]): ValidationResult<T> => ({
  valid: errors.length === 0,
  value,
  errors,
});

export const validateLoginBody = (source: unknown = {}): ValidationResult<LoginBody> => {
  const payload = source as Partial<LoginBody>;
  const password = String(payload.password ?? '');
  const errors: ValidationError[] = [];

  if (!password.trim()) {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    errors.push({ field: 'password', message: 'Password must be 256 characters or fewer.' });
  }

  return createValidationResult({ password }, errors);
};

export const validatePasswordUpdateBody = (
  source: unknown = {},
): ValidationResult<PasswordUpdateBody> => {
  const payload = source as Partial<PasswordUpdateBody>;
  const currentPassword = String(payload.currentPassword ?? '');
  const newPassword = String(payload.newPassword ?? '');
  const errors: ValidationError[] = [];

  if (!currentPassword.trim()) {
    errors.push({ field: 'currentPassword', message: 'Current password is required.' });
  }

  if (!newPassword.trim()) {
    errors.push({ field: 'newPassword', message: 'New password is required.' });
  }

  if (newPassword.length < 8) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 8 characters long.' });
  }

  if (newPassword.length > MAX_PASSWORD_LENGTH) {
    errors.push({ field: 'newPassword', message: 'New password must be 256 characters or fewer.' });
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push({
      field: 'newPassword',
      message: 'New password must be different from the current password.',
    });
  }

  return createValidationResult({ currentPassword, newPassword }, errors);
};

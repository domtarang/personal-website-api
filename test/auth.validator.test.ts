import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLoginBody, validatePasswordUpdateBody } from '../src/validators/auth.validator';

test('validateLoginBody requires a password', () => {
  const result = validateLoginBody({});

  assert.equal(result.valid, false);
  assert.equal(result.errors[0]?.field, 'password');
});

test('validatePasswordUpdateBody enforces minimum length and changed password', () => {
  const result = validatePasswordUpdateBody({
    currentPassword: 'password123',
    newPassword: 'password123',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.message.includes('different')));
});

test('validatePasswordUpdateBody accepts a valid payload', () => {
  const result = validatePasswordUpdateBody({
    currentPassword: 'old-password',
    newPassword: 'new-password-123',
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.value, {
    currentPassword: 'old-password',
    newPassword: 'new-password-123',
  });
});

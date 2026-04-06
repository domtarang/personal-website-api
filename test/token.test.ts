import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSessionToken, getBearerToken, hashToken } from '../src/utils/token';

test('generateSessionToken creates a non-empty random token', () => {
  const token = generateSessionToken();

  assert.equal(typeof token, 'string');
  assert.ok(token.length > 0);
});

test('getBearerToken extracts a bearer token', () => {
  assert.equal(getBearerToken('Bearer abc123'), 'abc123');
  assert.equal(getBearerToken('Basic abc123'), '');
});

test('hashToken returns a deterministic hash', () => {
  assert.equal(hashToken('token-value'), hashToken('token-value'));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app';

test('GET / returns the root payload and security headers', async () => {
  const response = await request(app)
    .get('/')
    .set('Origin', 'http://localhost:5173')
    .expect(200);

  assert.deepEqual(response.body, { message: 'API is running.' });
  assert.equal(response.headers['access-control-allow-origin'], 'http://localhost:5173');
  assert.equal(response.headers['x-frame-options'], 'DENY');
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
});

test('GET / blocks disallowed CORS origins', async () => {
  const response = await request(app)
    .get('/')
    .set('Origin', 'https://malicious.example')
    .expect(403);

  assert.equal(response.body.message, 'CORS origin is not allowed.');
});

test('GET /missing returns a JSON 404 response', async () => {
  const response = await request(app).get('/missing').expect(404);

  assert.equal(response.body.message, 'Route not found.');
});

test('POST /api/auth/login validates the request body before reaching the controller', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .set('X-Test-Rate-Limit-Key', 'validation-check')
    .send({})
    .expect(400);

  assert.equal(response.body.message, 'Validation failed.');
  assert.ok(Array.isArray(response.body.details.errors));
});

test('POST /api/auth/login rate limits repeated attempts from the same client', async () => {
  const agent = request(app);
  const limiterKey = 'rate-limit-sequence';

  await agent.post('/api/auth/login').set('X-Test-Rate-Limit-Key', limiterKey).send({}).expect(400);
  await agent.post('/api/auth/login').set('X-Test-Rate-Limit-Key', limiterKey).send({}).expect(400);

  const response = await agent
    .post('/api/auth/login')
    .set('X-Test-Rate-Limit-Key', limiterKey)
    .send({})
    .expect(429);

  assert.equal(response.body.message, 'Too many authentication attempts. Please try again later.');
  assert.ok(response.headers['ratelimit-policy']);
});

test('POST /api/auth/logout rejects unauthenticated requests', async () => {
  const response = await request(app).post('/api/auth/logout').expect(401);

  assert.equal(response.body.message, 'Unauthorized.');
});

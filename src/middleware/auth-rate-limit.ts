import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import env from '../config/env';

const authRateLimit = rateLimit({
  keyGenerator(req) {
    const testKey = env.nodeEnv === 'test' ? req.get('x-test-rate-limit-key') : undefined;

    if (testKey) {
      return testKey;
    }

    return ipKeyGenerator(req.ip ?? req.socket.remoteAddress ?? 'unknown');
  },
  windowMs: env.authRateLimitWindowMs,
  limit: env.authRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler(_req, res) {
    res.status(429).json({
      message: 'Too many authentication attempts. Please try again later.',
    });
  },
});

export default authRateLimit;

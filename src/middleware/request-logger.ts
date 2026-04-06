import type { RequestHandler } from 'express';
import logger from '../utils/logger';

const requestLogger: RequestHandler = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const context = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip,
      userAgent: req.get('user-agent') ?? 'unknown',
    };

    if (res.statusCode >= 500) {
      logger.error('Request completed with server error.', context);
      return;
    }

    if (res.statusCode >= 400) {
      logger.warn('Request completed with client error.', context);
      return;
    }

    logger.info('Request completed.', context);
  });

  next();
};

export default requestLogger;

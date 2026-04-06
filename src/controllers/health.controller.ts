import type { RequestHandler } from 'express';
import { query } from '../config/database';
import env from '../config/env';

export const getRoot: RequestHandler = (_req, res) => {
  res.status(200).json({
    message: 'API is running.',
  });
};

export const getHealth: RequestHandler = async (_req, res) => {
  await query('SELECT 1');

  res.status(200).json({
    status: 'ok',
    environment: env.nodeEnv,
    database: 'connected',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};

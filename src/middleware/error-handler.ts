import type { ErrorRequestHandler } from 'express';
import HttpError from '../utils/http-error';
import logger from '../utils/logger';

const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400 &&
    'body' in error
  ) {
    return res.status(400).json({
      message: 'Invalid JSON body.',
    });
  }

  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const payload: Record<string, unknown> = {
    message: error instanceof HttpError ? error.message : 'Unexpected server error.',
  };

  if (error instanceof HttpError && error.details) {
    payload.details = error.details;
  }

  if (statusCode >= 500) {
    logger.error('Unhandled request error.', { error, statusCode });
  }

  return res.status(statusCode).json(payload);
};

export default errorHandler;

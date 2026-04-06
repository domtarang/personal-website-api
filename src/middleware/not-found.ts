import type { RequestHandler } from 'express';
import HttpError from '../utils/http-error';

const notFound: RequestHandler = (_req, _res, next) => {
  next(HttpError.notFound('Route not found.'));
};

export default notFound;

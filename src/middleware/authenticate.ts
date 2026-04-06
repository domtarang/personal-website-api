import type { RequestHandler } from 'express';
import HttpError from '../utils/http-error';
import * as authService from '../services/auth.service';

const authenticate: RequestHandler = async (req, _res, next) => {
  const session = await authService.verifySession(req.headers.authorization ?? '');

  if (!session) {
    return next(HttpError.unauthorized());
  }

  req.auth = session;
  return next();
};

export default authenticate;

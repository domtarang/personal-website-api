import type { NextFunction, Request, RequestHandler, Response } from 'express';
import HttpError from '../utils/http-error';
import type { ValidationResult } from '../types/validation';

type RequestTarget = 'body' | 'params' | 'query';
type Validator<T> = (input: unknown) => ValidationResult<T>;

const validateRequest = <T>(validator: Validator<T>, target: RequestTarget = 'body'): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = validator(req[target]);

    if (!result.valid) {
      return next(
        HttpError.badRequest('Validation failed.', {
          errors: result.errors,
        }),
      );
    }

    switch (target) {
      case 'body':
        req.body = result.value;
        break;
      case 'params':
        req.params = result.value as Request['params'];
        break;
      case 'query':
        req.query = result.value as Request['query'];
        break;
      default:
        break;
    }

    return next();
  };
};

export default validateRequest;

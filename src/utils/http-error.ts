export default class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details: unknown;

  public constructor(statusCode: number, message: string, details: unknown = null) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.details = details;
  }

  public static badRequest(message: string, details: unknown = null): HttpError {
    return new HttpError(400, message, details);
  }

  public static unauthorized(message = 'Unauthorized.', details: unknown = null): HttpError {
    return new HttpError(401, message, details);
  }

  public static forbidden(message = 'Forbidden.', details: unknown = null): HttpError {
    return new HttpError(403, message, details);
  }

  public static notFound(message = 'Not found.', details: unknown = null): HttpError {
    return new HttpError(404, message, details);
  }
}

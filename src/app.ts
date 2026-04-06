import express, { type Express } from 'express';
import cors, { type CorsOptions } from 'cors';
import helmet from 'helmet';
import env from './config/env';
import routes from './routes';
import notFound from './middleware/not-found';
import errorHandler from './middleware/error-handler';
import requestLogger from './middleware/request-logger';
import HttpError from './utils/http-error';

const app: Express = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || env.corsAllowedOrigins === '*') {
      return callback(null, true);
    }

    if (env.corsAllowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(HttpError.forbidden('CORS origin is not allowed.'));
  },
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

app.disable('x-powered-by');
app.set('trust proxy', env.trustProxy);
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'same-site' },
  referrerPolicy: { policy: 'no-referrer' },
  xFrameOptions: { action: 'deny' },
  hsts: env.isProduction
    ? {
        maxAge: 15552000,
        includeSubDomains: true,
      }
    : false,
}));
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(express.json({ limit: env.requestBodyLimit }));
app.use(express.urlencoded({ extended: false, limit: env.requestBodyLimit }));
app.use(routes);
app.use(notFound);
app.use(errorHandler);

export default app;

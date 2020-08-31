import { adaptMiddleware } from '../configuration/adapters/express-middleware-adapter';
import { makeAuthMiddleware } from '../patterns/factories/middlewares/auth-middleware-factory';

export const auth = adaptMiddleware(makeAuthMiddleware());

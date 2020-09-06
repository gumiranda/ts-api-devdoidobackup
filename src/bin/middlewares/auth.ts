import { adaptMiddleware } from '@/bin/configuration/adapters/express-middleware-adapter';
import { makeAuthMiddleware } from '@/bin/patterns/factories/middlewares/auth-middleware-factory';

export const auth = adaptMiddleware(makeAuthMiddleware());

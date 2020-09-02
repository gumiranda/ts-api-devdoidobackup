import { Middleware } from '../../../middlewares/protocols/middleware';
import { AuthMiddleware } from '../../../middlewares/auth/auth-middleware';
import { makeDbLoadAccountByToken } from '../usecases/account/load-account-by-token/db-load-account-by-token-factory';

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role);
};
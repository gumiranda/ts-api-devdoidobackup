import { Middleware } from '@/bin/middlewares/protocols/middleware';
import { AuthMiddleware } from '@/bin/middlewares/auth/auth-middleware';
import { makeDbLoadAccountByToken } from '@/modules/account/factories/usecases/load-account-by-token/db-load-account-by-token-factory';

export const makeAuthMiddleware = (role?: string): Middleware => {
  const dbLoadAccountByToken = makeDbLoadAccountByToken();
  return new AuthMiddleware(dbLoadAccountByToken, role);
};

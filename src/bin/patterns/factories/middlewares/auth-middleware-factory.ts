import { Middleware } from '@/bin/middlewares/protocols/middleware';
import { AuthMiddleware } from '@/bin/middlewares/auth/auth-middleware';
import { makeDbLoadUserByToken } from '@/modules/user/factories/usecases/load-user-by-token/db-load-user-by-token-factory';

export const makeAuthMiddleware = (role?: string): Middleware => {
  const dbLoadUserByToken = makeDbLoadUserByToken();
  return new AuthMiddleware(dbLoadUserByToken, role);
};

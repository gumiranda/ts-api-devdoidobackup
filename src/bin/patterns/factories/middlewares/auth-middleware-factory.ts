import { Middleware } from '@/bin/middlewares/protocols/middleware';
import { AuthMiddleware } from '@/bin/middlewares/auth/auth-middleware';
import { makeDbLoadUserByToken } from '@/modules/user/factories/usecases/load-user-by-token/db-load-user-by-token-factory';
import { makeDbPayAgain } from '../../../../modules/payment/factories/usecases/pay-again/db-pay-again-factory';

export const makeAuthMiddleware = (role?: string): Middleware => {
  const dbLoadUserByToken = makeDbLoadUserByToken();
  const dbPayAgain = makeDbPayAgain();
  return new AuthMiddleware(dbLoadUserByToken, dbPayAgain, role);
};

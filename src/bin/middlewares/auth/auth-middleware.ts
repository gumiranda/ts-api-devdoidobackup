import { LoadUserById } from './../../../modules/user/usecases/load-user-by-id/load-user-by-id';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { forbidden, ok, serverError } from '@/bin/helpers/http-helper';
import { AccessDeniedError } from '@/bin/errors';
import { LoadUserByToken } from '@/modules/user/usecases/load-user-by-token/load-user-by-token';
import { Middleware } from '@/bin/middlewares/protocols/middleware';
import { isPast } from '@/bin/utils/date-fns';
import { PayAgain } from '../../../modules/payment/usecases/pay-again/pay-again';
export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadUserByToken: LoadUserByToken,
    private readonly loadUserById: LoadUserById,
    private readonly payAgain: PayAgain,
    private readonly role?: string,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const authHeader = httpRequest.headers?.authorization;
      if (authHeader) {
        const [, accessToken] = authHeader.split(' ');
        if (accessToken) {
          const user = await this.loadUserByToken.load(accessToken, this.role);
          if (user) {
            if (user.role === 'owner') {
              const payVerification = await payMiddleware(user, this.payAgain);
              if (payVerification) {
                return payVerification;
              }
            } else if (user.role === 'professional' && user.ownerId) {
              const owner = this.loadUserById.loadById(user.ownerId.toString());
              const payVerification = await payMiddleware(owner, this.payAgain);
              if (payVerification) {
                return payVerification;
              }
            }
            return ok({ userId: user._id });
          }
        }
      }
      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}
const payMiddleware = async (user, payAgain) => {
  if (!user.payDay) {
    const paid = await payAgain.payEasy(user._id);
    if (!paid) {
      return forbidden(new AccessDeniedError());
    }
  } else {
    if (isPast(new Date(user.payDay))) {
      return forbidden(new AccessDeniedError());
    }
  }
  return false;
};

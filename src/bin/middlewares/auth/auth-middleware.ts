import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { forbidden, ok, serverError } from '@/bin/helpers/http-helper';
import { AccessDeniedError } from '@/bin/errors';
import { LoadAccountByToken } from '@/modules/account/usecases/load-account-by-token/load-account-by-token';
import { Middleware } from '@/bin/middlewares/protocols/middleware';
import { isPast } from '@/bin/utils/date-fns';
export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const authHeader = httpRequest.headers?.authorization;
      if (authHeader) {
        const [, accessToken] = authHeader.split(' ');
        if (accessToken) {
          const account = await this.loadAccountByToken.load(
            accessToken,
            this.role,
          );
          if (account) {
            if (account.role === 'owner') {
              if (!account.payDay) {
                return forbidden(new AccessDeniedError());
              } else {
                if (isPast(new Date(account.payDay))) {
                  return forbidden(new AccessDeniedError());
                }
              }
            }
            return ok({ accountId: account._id });
          }
        }
      }
      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}

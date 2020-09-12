import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { forbidden, ok, serverError } from '@/bin/helpers/http-helper';
import { AccessDeniedError } from '@/bin/errors';
import { LoadUserByToken } from '@/modules/user/usecases/load-user-by-token/load-user-by-token';
import { Middleware } from '@/bin/middlewares/protocols/middleware';
import { isPast } from '@/bin/utils/date-fns';
export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadUserByToken: LoadUserByToken,
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
              if (!user.payDay) {
                return forbidden(new AccessDeniedError());
              } else {
                if (isPast(new Date(user.payDay))) {
                  return forbidden(new AccessDeniedError());
                }
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

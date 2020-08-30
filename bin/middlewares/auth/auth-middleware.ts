import { Middleware } from '../protocols/middleware';
import { HttpRequest, HttpResponse } from '../../protocols/http';
import { forbidden, ok, serverError } from '../../helpers/http-helper';
import { AccessDeniedError } from '../../errors';
import { LoadAccountByToken } from '../protocols/usecases/load-account-by-token';
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
            return ok({ _id: account._id });
          }
        }
      }
      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}

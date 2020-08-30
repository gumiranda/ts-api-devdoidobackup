import { Middleware } from '../protocols/middleware';
import { HttpRequest, HttpResponse } from '../../protocols/http';
import { forbidden } from '../../helpers/http-helper';
import { AccessDeniedError } from '../../errors';
import { LoadAccountByToken } from '../protocols/usecases/load-account-by-token';
export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const authHeader = httpRequest.headers?.Authorization;
    if (authHeader) {
      const [, accessToken] = authHeader.split(' ');
      if (accessToken) {
        await this.loadAccountByToken.load(accessToken);
      }
    }
    return forbidden(new AccessDeniedError());
  }
}

import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  forbidden,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { InvalidParamError } from '@/bin/errors';
import { LoadUserByPage } from '@/modules/user/usecases/load-user-by-page/load-user-by-page';

export class LoadUserByPageController implements Controller {
  constructor(private readonly loadUserByPage: LoadUserByPage) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { page } = httpRequest.params;
      const { userId } = httpRequest;
      const users = await this.loadUserByPage.loadByPage(page, userId);
      if (!users) {
        return forbidden(new InvalidParamError('page'));
      }
      return users ? ok(users) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

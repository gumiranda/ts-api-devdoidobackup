import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  forbidden,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { InvalidParamError } from '@/bin/errors';
import { LoadAccountByPage } from '../../usecases/load-account-by-page/load-account-by-page';

export class LoadAccountByPageController implements Controller {
  constructor(private readonly loadAccountByPage: LoadAccountByPage) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { page } = httpRequest.params;
      const { accountId } = httpRequest;
      const accounts = await this.loadAccountByPage.loadByPage(page, accountId);
      if (!accounts) {
        return forbidden(new InvalidParamError('page'));
      }
      return accounts ? ok(accounts) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  forbidden,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { InvalidParamError } from '@/bin/errors';
import { LoadRequestByPage } from '../../usecases/load-request-by-page/load-request-by-page';

export class LoadRequestByPageController implements Controller {
  constructor(private readonly loadRequestByPage: LoadRequestByPage) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { page } = httpRequest.params;
      const { userId } = httpRequest;
      const requests = await this.loadRequestByPage.loadByPage(page, userId);
      if (!requests) {
        return forbidden(new InvalidParamError('page'));
      }
      return requests ? ok(requests) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

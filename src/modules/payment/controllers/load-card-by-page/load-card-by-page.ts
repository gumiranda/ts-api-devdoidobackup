import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  forbidden,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { InvalidParamError } from '@/bin/errors';
import { LoadCardByPage } from '../../usecases/load-card-by-page/load-card-by-page';

export class LoadCardByPageController implements Controller {
  constructor(private readonly loadCardByPage: LoadCardByPage) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { page } = httpRequest.params;
      const { userId } = httpRequest;
      const cards = await this.loadCardByPage.loadByPage(page, userId);
      if (!cards) {
        return forbidden(new InvalidParamError('page'));
      }
      return cards ? ok(cards) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

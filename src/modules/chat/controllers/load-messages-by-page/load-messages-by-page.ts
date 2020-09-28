import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  forbidden,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { InvalidParamError } from '@/bin/errors';
import { LoadMessagesByPage } from '../../usecases/load-messages-by-page/load-messages-by-page';

export class LoadMessagesByPageController implements Controller {
  constructor(private readonly loadMessagesByPage: LoadMessagesByPage) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { page, chatId } = httpRequest.params;
      const { userId } = httpRequest;
      const chat = await this.loadMessagesByPage.loadMessagesByPage(
        page,
        chatId,
        userId,
      );
      console.log(chat);
      if (!chat) {
        if (page) {
          return forbidden(new InvalidParamError('chatId'));
        }
        return forbidden(new InvalidParamError('page'));
      }
      return chat ? ok(chat) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

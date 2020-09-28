import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  forbidden,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { InvalidParamError } from '@/bin/errors';
import { LoadChatByPage } from '../../usecases/load-chat-by-page/load-chat-by-page';

export class LoadChatByPageController implements Controller {
  constructor(private readonly loadChatByPage: LoadChatByPage) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { page } = httpRequest.params;
      const { userId } = httpRequest;
      const chats = await this.loadChatByPage.loadByPage(page, userId);
      if (!chats) {
        return forbidden(new InvalidParamError('page'));
      }
      return chats ? ok(chats) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

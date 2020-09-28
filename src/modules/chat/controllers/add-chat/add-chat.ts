import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import {
  badRequest,
  serverError,
  noContent,
  createdOk,
} from '@/bin/helpers/http-helper';
import { AddChat } from '../../usecases/add-chat/add-chat';

export class AddChatController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addChat: AddChat,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { userFor } = httpRequest.body;
      const { userId } = httpRequest;

      const chat = await this.addChat.add({
        userBy: userId,
        lastMessage: '',
        userFor,
        countMessages: 0,
        messages: [],
        createdAt: new Date(),
      });
      return chat ? createdOk(chat) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

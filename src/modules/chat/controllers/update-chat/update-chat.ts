import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import {
  badRequest,
  putOk,
  serverError,
  noContent,
} from '@/bin/helpers/http-helper';
import { UpdateChat } from '../../usecases/update-chat/update-chat';

export class UpdateChatController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly updateChat: UpdateChat,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { chatId } = httpRequest.params;
      const { userId } = httpRequest;
      const { message } = httpRequest.body;

      const chat = await this.updateChat.updateChat(
        {
          message,
        },
        userId,
        chatId,
      );
      return chat
        ? putOk({ message: 'Mensagem enviada com sucesso' })
        : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

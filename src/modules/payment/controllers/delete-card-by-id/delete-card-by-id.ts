import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  forbidden,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { InvalidParamError } from '@/bin/errors';
import { DeleteCardById } from '../../usecases/delete-card-by-id/delete-card-by-id';

export class DeleteCardByIdController implements Controller {
  constructor(private readonly deleteCardById: DeleteCardById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { cardId } = httpRequest.params;
      const { userId } = httpRequest;
      const cardDeleted = await this.deleteCardById.deleteById(cardId, userId);
      if (!cardDeleted) {
        return forbidden(new InvalidParamError('cardId'));
      }
      return cardDeleted ? ok(cardDeleted) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

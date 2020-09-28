import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import {
  badRequest,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { AddNotification } from '../../usecases/add-notification/add-notification';

export class AddNotificationController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addNotification: AddNotification,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { content, type, userFor } = httpRequest.body;
      const { userId } = httpRequest;

      const notification = await this.addNotification.add({
        userBy: userId,
        content,
        userFor,
        type,
        read: false,
        createdAt: new Date(),
      });
      return notification ? ok(notification) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

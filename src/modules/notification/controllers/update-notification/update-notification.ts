import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import {
  badRequest,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { UpdateNotification } from '../../usecases/update-notification/update-notification';
import { putOk } from '../../../../bin/helpers/http-helper';

export class UpdateNotificationController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly updateNotification: UpdateNotification,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { notificationId } = httpRequest.params;
      const { read } = httpRequest.body;

      const notification = await this.updateNotification.updateNotification(
        {
          read,
        },
        notificationId,
      );
      return notification ? putOk(notification) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

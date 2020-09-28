import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  forbidden,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { InvalidParamError } from '@/bin/errors';
import { LoadNotificationByPage } from '../../usecases/load-notification-by-page/load-notification-by-page';

export class LoadNotificationByPageController implements Controller {
  constructor(
    private readonly loadNotificationByPage: LoadNotificationByPage,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { page } = httpRequest.params;
      const { userId } = httpRequest;
      const notifications = await this.loadNotificationByPage.loadByPage(
        page,
        userId,
      );
      if (!notifications) {
        return forbidden(new InvalidParamError('page'));
      }
      return notifications ? ok(notifications) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

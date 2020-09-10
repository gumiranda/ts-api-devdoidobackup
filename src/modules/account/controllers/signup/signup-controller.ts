import { Controller } from '@/bin/protocols/controller';
import { AddAccount } from '@/modules/account/usecases/add-account/add-account';
import { HttpResponse, HttpRequest } from '@/bin/protocols/http';
import {
  badRequest,
  serverError,
  ok,
  forbidden,
} from '@/bin/helpers/http-helper';
import { Validation } from '@/bin/helpers/validators/validation';
import { EmailInUseError } from '@/bin/errors';
import OneSignal from '@/bin/helpers/onesignal';
import { addDay } from '@/bin/utils/date-fns';
export class SignUpController implements Controller {
  private readonly addAccount: AddAccount;
  private readonly validation: Validation;

  constructor(addAccount: AddAccount, validation: Validation) {
    this.validation = validation;
    this.addAccount = addAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      if (!httpRequest.body.role || httpRequest.body?.role === 'admin') {
        httpRequest.body.role = 'client';
      }
      const {
        name,
        email,
        password,
        role,
        pushToken,
        coord,
        plan,
      } = httpRequest.body;
      let position = coord;
      const payDay = addDay(new Date(), 7);
      let obj: any = {
        name,
        email,
        password,
        role,
        coord: { type: 'Point', coordinates: position },
        payDay,
        createdAt: new Date(),
      };
      if (plan) {
        obj.plan = plan;
      } else {
        obj.plan = 'basic';
      }
      const account = await this.addAccount.add(obj);
      if (!account) {
        return forbidden(new EmailInUseError());
      }
      if (pushToken) {
        await OneSignal.addDevice(pushToken);
      }
      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}

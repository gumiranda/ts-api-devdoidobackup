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
      if (!httpRequest.body.role) {
        httpRequest.body.role = 'client';
      }
      const { name, email, password, role, pushToken } = httpRequest.body;
      const account = await this.addAccount.add({
        name,
        email,
        password,
        role,
        pushToken,
      });
      if (!account) {
        return forbidden(new EmailInUseError());
      }
      if (pushToken) {
        await OneSignal.addDevice(pushToken);
      }
      return ok(account);
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}

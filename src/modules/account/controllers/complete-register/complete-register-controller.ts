import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  serverError,
  noContent,
  ok,
  badRequest,
} from '@/bin/helpers/http-helper';
import { UpdateAccount } from '../../usecases/update-account/update-account';
import { Validation } from '@/bin/helpers/validators/validation';

export class CompleteRegisterController implements Controller {
  constructor(
    private readonly updateAccount: UpdateAccount,
    private readonly validation: Validation,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { body } = httpRequest;
      const { accountId } = httpRequest;
      const accountUpdated = await this.updateAccount.updateAccount(
        body,
        accountId,
      );
      return accountUpdated ? ok(accountUpdated) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

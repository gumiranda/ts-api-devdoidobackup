import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  serverError,
  noContent,
  ok,
  badRequest,
} from '@/bin/helpers/http-helper';
import { Validation } from '@/bin/helpers/validators/validation';
import { UpdatePassword } from '../../usecases/update-password/update-password';

export class UpdatePasswordController implements Controller {
  constructor(
    private readonly updatePassword: UpdatePassword,
    private readonly validation: Validation,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { newPassword, oldPassword } = httpRequest.body;
      const { userId } = httpRequest;
      const userUpdated = await this.updatePassword.updatePassword(
        newPassword,
        oldPassword,
        userId,
      );
      return userUpdated ? ok(userUpdated) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

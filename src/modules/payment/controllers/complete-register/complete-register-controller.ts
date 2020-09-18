import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  serverError,
  noContent,
  ok,
  badRequest,
} from '@/bin/helpers/http-helper';
import { UpdateUser } from '../../usecases/update-user/update-user';
import { Validation } from '@/bin/helpers/validators/validation';

export class CompleteRegisterController implements Controller {
  constructor(
    private readonly updateUser: UpdateUser,
    private readonly validation: Validation,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { body } = httpRequest;
      const { userId } = httpRequest;
      const userUpdated = await this.updateUser.updateUser(body, userId);
      return userUpdated ? ok(userUpdated) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

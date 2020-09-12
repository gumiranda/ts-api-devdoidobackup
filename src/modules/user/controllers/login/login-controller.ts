import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  badRequest,
  serverError,
  ok,
  unauthorized,
} from '@/bin/helpers/http-helper';
import { Validation } from '@/bin/helpers/validators/validation';
import { Authentication } from '@/modules/user/usecases/auth/authentication';

export class LoginController implements Controller {
  private readonly validation: Validation;
  private readonly authentication: Authentication;

  constructor(validation: Validation, authentication: Authentication) {
    this.validation = validation;
    this.authentication = authentication;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { email, password } = httpRequest.body;
      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }
      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}

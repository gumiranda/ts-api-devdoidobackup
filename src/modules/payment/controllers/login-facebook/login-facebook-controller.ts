import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  badRequest,
  serverError,
  ok,
  unauthorized,
} from '@/bin/helpers/http-helper';
import { Validation } from '@/bin/helpers/validators/validation';
import { AuthenticationFacebook } from '../../usecases/auth-fb/authentication-facebook';

export class LoginFacebookController implements Controller {
  private readonly validation: Validation;
  private readonly authenticationFacebook: AuthenticationFacebook;

  constructor(
    validation: Validation,
    authenticationFacebook: AuthenticationFacebook,
  ) {
    this.validation = validation;
    this.authenticationFacebook = authenticationFacebook;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { faceId, faceToken } = httpRequest.body;
      const accessToken = await this.authenticationFacebook.authFacebook(
        faceId,
        faceToken,
      );
      if (!accessToken) {
        return unauthorized();
      }
      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}

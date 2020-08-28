import { Controller } from '../../../../bin/protocols/controller';
import { HttpRequest, HttpResponse } from '../../../../bin/protocols/http';
import { Validation } from '../../../../bin/helpers/validators/validation';
import { badRequest } from '../../../../bin/helpers/http-helper';

export class AddRatingController implements Controller {
  constructor(private readonly validation: Validation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const errors = this.validation.validate(httpRequest.body);
    if (errors) {
      return badRequest(errors);
    }
    return new Promise((resolve) => resolve(null));
  }
}

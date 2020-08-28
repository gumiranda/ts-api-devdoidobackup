import { Controller } from '../../../../bin/protocols/controller';
import { HttpRequest, HttpResponse } from '../../../../bin/protocols/http';
import { Validation } from '../../../../bin/helpers/validators/validation';
import {
  badRequest,
  serverError,
  noContent,
} from '../../../../bin/helpers/http-helper';
import { AddRating } from '../../usecases/add-rating/add-rating';

export class AddRatingController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addRating: AddRating,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors) {
        return badRequest(errors);
      }
      const { ratingType, ratings } = httpRequest.body;
      await this.addRating.add({ ratingType, ratings });
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
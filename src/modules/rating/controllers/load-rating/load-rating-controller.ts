import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import {
  badRequest,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { LoadRating } from '@/modules/rating/usecases/load-rating/load-rating';

export class LoadRatingController implements Controller {
  constructor(private readonly loadRating: LoadRating) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const ratings = await this.loadRating.load();
      return ratings.length ? ok(ratings) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

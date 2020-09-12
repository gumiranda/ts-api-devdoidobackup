import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import {
  forbidden,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { LoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/load-rating-by-id';
import { InvalidParamError } from '@/bin/errors';
import { LoadRatingResult } from '@/modules/rating/usecases/load-rating-result/load-rating-result';

export class LoadRatingResultController implements Controller {
  constructor(
    private readonly loadRatingById: LoadRatingById,
    private readonly loadRatingResult: LoadRatingResult,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { ratingId, ratingFor } = httpRequest.params;
      const rating = await this.loadRatingById.loadById(ratingId);
      if (!rating) {
        return forbidden(new InvalidParamError('ratingId'));
      }
      const ratingResult = await this.loadRatingResult.load(
        ratingId,
        ratingFor,
      );
      return ratingResult ? ok(ratingResult) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

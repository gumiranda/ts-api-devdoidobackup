import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import {
  badRequest,
  serverError,
  noContent,
  forbidden,
} from '@/bin/helpers/http-helper';
import { SaveRatingResult } from '../../usecases/save-rating-result/save-rating-result';
import { LoadRatingById } from '../../usecases/load-rating-by-id/load-rating-by-id';
import { InvalidParamError } from '@/bin/errors';

export class SaveRatingResultController implements Controller {
  constructor(
    private readonly loadRatingById: LoadRatingById,
    private readonly saveRating: SaveRatingResult,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const rating = await this.loadRatingById.loadById(
        httpRequest.params.ratingId,
      );
      if (!rating) {
        return forbidden(new InvalidParamError('ratingId'));
      }
      return null;
    } catch (error) {
      return serverError(error);
    }
  }
}

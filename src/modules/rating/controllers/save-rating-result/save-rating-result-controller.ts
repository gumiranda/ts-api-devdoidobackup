import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { serverError, forbidden, ok } from '@/bin/helpers/http-helper';
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
      const { ratingId } = httpRequest.params;
      const { accountId } = httpRequest;
      const { result } = httpRequest.body;

      const rating = await this.loadRatingById.loadById(ratingId);
      if (!rating) {
        return forbidden(new InvalidParamError('ratingId'));
      }
      const ratingSaved = await this.saveRating.save({
        accountId,
        ratingId,
        result,
        date: new Date(),
      });
      return ok(ratingSaved);
    } catch (error) {
      return serverError(error);
    }
  }
}

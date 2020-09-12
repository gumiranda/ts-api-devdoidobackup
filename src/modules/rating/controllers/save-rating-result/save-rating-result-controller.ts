import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { serverError, forbidden, ok } from '@/bin/helpers/http-helper';
import { SaveRatingResult } from '@/modules/rating/usecases/save-rating-result/save-rating-result';
import { LoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/load-rating-by-id';
import { InvalidParamError } from '@/bin/errors';
import { LoadAccountById } from '@/modules/account/usecases/load-account-by-id/load-account-by-id';

export class SaveRatingResultController implements Controller {
  constructor(
    private readonly loadRatingById: LoadRatingById,
    private readonly loadAccountById: LoadAccountById,
    private readonly saveRating: SaveRatingResult,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { ratingId, ratingFor } = httpRequest.params;
      const { accountId } = httpRequest;
      const { rating } = httpRequest.body;
      const ratingLoaded = await this.loadRatingById.loadById(ratingId);
      if (ratingLoaded) {
        const ratings = ratingLoaded.ratings.map((a) => a.rating);
        if (!ratings.includes(rating)) {
          return forbidden(new InvalidParamError('rating'));
        }
      } else {
        return forbidden(new InvalidParamError('ratingId'));
      }
      const accountLoaded = await this.loadAccountById.loadById(ratingFor);
      if (!accountLoaded || accountLoaded.role === 'client') {
        return forbidden(new InvalidParamError('ratingFor'));
      }
      const ratingSaved = await this.saveRating.save({
        accountId,
        ratingId,
        ratingFor,
        rating,
        createdAt: new Date(),
      });
      return ok(ratingSaved);
    } catch (error) {
      return serverError(error);
    }
  }
}

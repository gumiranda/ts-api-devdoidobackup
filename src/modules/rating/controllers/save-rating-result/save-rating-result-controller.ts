import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { serverError, forbidden, ok } from '@/bin/helpers/http-helper';
import { SaveRatingResult } from '@/modules/rating/usecases/save-rating-result/save-rating-result';
import { LoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/load-rating-by-id';
import { InvalidParamError } from '@/bin/errors';
import { LoadUserById } from '@/modules/user/usecases/load-user-by-id/load-user-by-id';

export class SaveRatingResultController implements Controller {
  constructor(
    private readonly loadRatingById: LoadRatingById,
    private readonly loadUserById: LoadUserById,
    private readonly saveRating: SaveRatingResult,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { ratingId, ratingFor } = httpRequest.params;
      const { userId } = httpRequest;
      const { rating, comment } = httpRequest.body;
      const ratingLoaded = await this.loadRatingById.loadById(ratingId);
      if (ratingLoaded) {
        const ratings = ratingLoaded.ratings.map((a) => a.rating);
        if (!ratings.includes(rating)) {
          return forbidden(new InvalidParamError('rating'));
        }
      } else {
        return forbidden(new InvalidParamError('ratingId'));
      }
      const userLoaded = await this.loadUserById.loadById(ratingFor);
      if (!userLoaded || userLoaded.role === 'client') {
        return forbidden(new InvalidParamError('ratingFor'));
      }
      const ratingSaved = await this.saveRating.save({
        userId,
        ratingId,
        ratingFor,
        rating,
        comment,
        createdAt: new Date(),
      });
      return ok(ratingSaved);
    } catch (error) {
      return serverError(error);
    }
  }
}

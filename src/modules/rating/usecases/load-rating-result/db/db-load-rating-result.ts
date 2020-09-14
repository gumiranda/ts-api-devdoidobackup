import { LoadRatingResult } from '@/modules/rating/usecases/load-rating-result/load-rating-result';
import { LoadRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/load-rating-result-repository';
import { LoadRatingByIdRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-by-id-repository';
import { RatingResultModel } from '@/modules/rating/models/rating-result';

export class DbLoadRatingResult implements LoadRatingResult {
  constructor(
    private readonly loadRatingResultRepository: LoadRatingResultRepository,
    private readonly loadRatingByIdRepository: LoadRatingByIdRepository,
  ) {}

  async load(ratingId: string, ratingFor: string): Promise<RatingResultModel> {
    let ratingResult = await this.loadRatingResultRepository.loadByRatingIdRatingFor(
      ratingId,
      ratingFor,
    );
    console.warn('ratingResult', ratingResult);
    if (!ratingResult) {
      const {
        _id,
        ratingType,
        createdAt,
        ratings,
      } = await this.loadRatingByIdRepository.loadById(ratingId);
      ratingResult = {
        ratingId: _id,
        ratingType,
        ratingFor,
        createdAt,
        ratings: ratings.map((rating) =>
          Object.assign({}, rating, { count: 0, comment: '', percent: 0 }),
        ),
      };
    }
    return ratingResult;
  }
}

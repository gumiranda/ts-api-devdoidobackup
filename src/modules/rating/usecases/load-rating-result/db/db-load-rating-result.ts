import { LoadRatingResult } from '../load-rating-result';
import { LoadRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/load-rating-result-repository';
import { LoadRatingByIdRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-by-id-repository';
import { RatingResultModel } from '@/modules/rating/models/rating-result';

export class DbLoadRatingResult implements LoadRatingResult {
  constructor(
    private readonly loadRatingResultRepository: LoadRatingResultRepository,
    private readonly loadRatingByIdRepository: LoadRatingByIdRepository,
  ) {}

  async load(ratingId: string): Promise<RatingResultModel> {
    let ratingResult = await this.loadRatingResultRepository.loadByRatingId(
      ratingId,
    );
    if (!ratingResult) {
      const {
        _id,
        ratingType,
        date,
        ratings,
      } = await this.loadRatingByIdRepository.loadById(ratingId);
      ratingResult = {
        ratingId: _id,
        ratingType,
        date,
        ratings: ratings.map((rating) =>
          Object.assign({}, rating, { count: 0, percent: 0 }),
        ),
      };
    }
    return ratingResult;
  }
}

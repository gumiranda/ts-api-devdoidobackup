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
    const ratingResult = await this.loadRatingResultRepository.loadByRatingId(
      ratingId,
    );
    if (!ratingResult) {
      await this.loadRatingByIdRepository.loadById(ratingId);
    }
    return ratingResult;
  }
}

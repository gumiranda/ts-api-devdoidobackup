import { SaveRatingResult, SaveRatingResultModel } from '../save-rating-result';
import { SaveRatingResultRepository } from '@/modules/rating/repositories/rating/protocols/save-rating-result-repository';
import { RatingResultModel } from '@/modules/rating/models/rating-result';

export class DbSaveRatingResult implements SaveRatingResult {
  constructor(
    private readonly saveRatingRepository: SaveRatingResultRepository,
  ) {}
  async save(data: SaveRatingResultModel): Promise<RatingResultModel> {
    return await this.saveRatingRepository.save(data);
  }
}

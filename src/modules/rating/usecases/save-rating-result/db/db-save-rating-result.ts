import { SaveRatingResult, SaveRatingResultModel } from '../save-rating-result';
import { RatingResultModel } from '@/modules/rating/models/rating-result';
import { SaveRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/save-rating-result-repository';

export class DbSaveRatingResult implements SaveRatingResult {
  constructor(
    private readonly saveRatingRepository: SaveRatingResultRepository,
  ) {}
  async save(data: SaveRatingResultModel): Promise<RatingResultModel> {
    return await this.saveRatingRepository.save(data);
  }
}

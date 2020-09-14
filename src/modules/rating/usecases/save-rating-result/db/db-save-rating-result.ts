import { SaveRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/save-rating-result-repository';
import {
  SaveRatingResult,
  SaveRatingResultParams,
} from '@/modules/rating/usecases/save-rating-result/save-rating-result';
import { RatingResultModel } from '@/modules/rating/models/rating-result';
import { LoadRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/load-rating-result-repository';

export class DbSaveRatingResult implements SaveRatingResult {
  constructor(
    private readonly saveRatingRepository: SaveRatingResultRepository,
    private readonly loadRatingResultRepository: LoadRatingResultRepository,
  ) {}
  async save(data: SaveRatingResultParams): Promise<RatingResultModel> {
    console.log('vai salvar');
    await this.saveRatingRepository.save(data);
    console.log('salvou');
    const ratingResult = await this.loadRatingResultRepository.loadByRatingIdRatingFor(
      data.ratingId,
      data.ratingFor,
    );
    return ratingResult;
  }
}

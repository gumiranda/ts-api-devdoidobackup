import { RatingResultModel } from '@/modules/rating/models/rating-result';
import { SaveRatingResultParams } from '@/modules/rating/usecases/save-rating-result/save-rating-result';

export interface SaveRatingResultRepository {
  save(ratingData: SaveRatingResultParams): Promise<void>;
}

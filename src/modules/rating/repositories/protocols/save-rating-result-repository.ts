import { SaveRatingResultModel } from '../../usecases/save-rating-result/save-rating-result';
import { RatingResultModel } from '../../models/rating-result';

export interface SaveRatingResultRepository {
  save(ratingData: SaveRatingResultModel): Promise<RatingResultModel>;
}

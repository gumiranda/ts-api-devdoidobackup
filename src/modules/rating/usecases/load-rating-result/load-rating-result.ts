import { RatingResultModel } from '../../models/rating-result';

export interface LoadRatingResult {
  load(ratingId: string): Promise<RatingResultModel>;
}

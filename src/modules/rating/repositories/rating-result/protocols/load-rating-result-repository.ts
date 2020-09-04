import { RatingResultModel } from '@/modules/rating/models/rating-result';

export interface LoadRatingResultRepository {
  loadByRatingId(ratingId: string): Promise<RatingResultModel>;
}

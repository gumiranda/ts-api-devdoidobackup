import { RatingResultModel } from '@/modules/rating/models/rating-result';

export interface LoadRatingResultRepository {
  ratingResultModel: RatingResultModel;
  ratingId: string;
  loadByRatingId(ratingId: string): Promise<RatingResultModel>;
}

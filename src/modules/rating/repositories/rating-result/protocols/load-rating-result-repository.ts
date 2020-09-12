import { RatingResultModel } from '@/modules/rating/models/rating-result';

export interface LoadRatingResultRepository {
  ratingResultModel: RatingResultModel;
  ratingId: string;
  ratingFor: string;
  loadByRatingIdRatingFor(
    ratingId: string,
    ratingFor: string,
  ): Promise<RatingResultModel>;
}

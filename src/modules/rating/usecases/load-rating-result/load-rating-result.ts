import { RatingResultModel } from '@/modules/rating/models/rating-result';

export interface LoadRatingResult {
  load(ratingId: string, ratingFor: string): Promise<RatingResultModel>;
}

import { RatingResultModel } from '@/modules/rating/models/rating-result';

export interface SaveRatingResultRepository {
  save(ratingData: Omit<RatingResultModel, '_id'>): Promise<RatingResultModel>;
}

import { RatingModel } from '@/modules/rating/models/rating';

export interface LoadRatingRepository {
  loadAll(): Promise<RatingModel[]>;
}

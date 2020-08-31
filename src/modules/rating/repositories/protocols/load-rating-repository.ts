import { RatingModel } from '../../models/rating';

export interface LoadRatingRepository {
  loadAll(): Promise<RatingModel[]>;
}

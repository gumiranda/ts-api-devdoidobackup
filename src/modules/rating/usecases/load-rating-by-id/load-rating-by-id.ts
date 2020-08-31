import { RatingModel } from '../../models/rating';

export interface LoadRatingById {
  loadById(_id: string): Promise<RatingModel>;
}

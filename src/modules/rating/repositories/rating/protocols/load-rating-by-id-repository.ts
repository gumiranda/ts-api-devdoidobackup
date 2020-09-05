import { RatingModel } from '../../../models/rating';

export interface LoadRatingByIdRepository {
  ratingModel: RatingModel;
  _id: string;
  loadById(_id: string): Promise<RatingModel>;
}

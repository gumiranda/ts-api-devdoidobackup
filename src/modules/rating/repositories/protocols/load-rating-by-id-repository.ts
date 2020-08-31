import { RatingModel } from '../../models/rating';

export interface LoadRatingByIdRepository {
  loadById(_id: string): Promise<RatingModel>;
}

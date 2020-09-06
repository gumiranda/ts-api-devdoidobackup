import { RatingModel } from '@/modules/rating/models/rating';

export interface LoadRatingById {
  loadById(_id: string): Promise<RatingModel>;
}

import { RatingModel } from '../../models/rating';

export interface LoadRating {
  load(): Promise<RatingModel[]>;
}

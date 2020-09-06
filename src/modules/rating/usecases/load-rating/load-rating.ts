import { RatingModel } from '@/modules/rating/models/rating';

export interface LoadRating {
  load(): Promise<RatingModel[]>;
}

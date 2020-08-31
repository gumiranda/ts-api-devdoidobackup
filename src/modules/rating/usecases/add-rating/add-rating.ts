import { RatingModel } from '../../models/rating';

export type AddRatingModel = Omit<RatingModel, '_id'>;
export type RatingStars = {
  obs: string;
  stars: number;
  ratingType: string;
};

export type AddRating = {
  add(data: AddRatingModel): Promise<void>;
};

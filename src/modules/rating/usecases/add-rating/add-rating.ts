import { RatingModel } from '@/modules/rating/models/rating';

export type AddRatingModel = Omit<RatingModel, '_id'>;
export type RatingStars = {
  rating: string;
  stars: number;
};

export type AddRating = {
  add(data: AddRatingModel): Promise<void>;
};

export interface AddRatingModel {
  ratingType: string;
  ratings: RatingStars[];
}
export interface RatingStars {
  obs: string;
  stars: number;
}

export interface AddRating {
  add(data: AddRatingModel): Promise<void>;
}

export interface AddRatingModel {
  ratingFor: string;
  ratings: RatingStars[];
  date: Date;
}
export interface RatingStars {
  obs: string;
  stars: number;
  ratingType: string;
}

export interface AddRating {
  add(data: AddRatingModel): Promise<void>;
}

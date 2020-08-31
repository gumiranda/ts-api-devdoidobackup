export interface RatingModel {
  _id: string;
  ratingFor: string;
  ratings: RatingStarsModel[];
  date: Date;
}
export interface RatingStarsModel {
  obs: string;
  stars: number;
  ratingType: string;
}

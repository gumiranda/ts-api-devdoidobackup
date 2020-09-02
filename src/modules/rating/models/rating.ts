export type RatingModel = {
  _id: string;
  ratingFor: string;
  ratings: RatingStarsModel[];
  date: Date;
};
export type RatingStarsModel = {
  obs: string;
  stars: number;
  count: number;
  percent: number;
  ratingType: string;
};

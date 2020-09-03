export type RatingModel = {
  _id: string;
  ratingType: string;
  ratings: RatingStarsModel[];
  date: Date;
};
export type RatingStarsModel = {
  rating: string;
  stars: number;
};

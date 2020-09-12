export type RatingModel = {
  _id: string;
  ratingType: string;
  ratings: RatingStarsModel[];
  createdAt: Date;
};
export type RatingStarsModel = {
  rating: string;
  comment: string;
  stars: number;
};

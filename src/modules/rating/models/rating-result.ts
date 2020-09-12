export type RatingResultModel = {
  ratingId: string;
  ratingType: string;
  ratingFor: string;
  ratings: RatingResultStarsModel[];
  createdAt: Date;
};
type RatingResultStarsModel = {
  rating: string;
  stars: number;
  count: number;
  percent: number;
};

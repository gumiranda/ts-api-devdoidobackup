export type RatingResultModel = {
  ratingId: string;
  ratingType: string;
  ratings: RatingResultStarsModel[];
  date: Date;
};
type RatingResultStarsModel = {
  rating: string;
  stars: number;
  count: number;
  percent: number;
};

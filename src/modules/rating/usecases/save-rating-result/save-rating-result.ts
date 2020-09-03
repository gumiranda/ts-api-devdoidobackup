import { RatingResultModel } from '../../models/rating-result';

export type SaveRatingResultParams = {
  ratingId: string;
  accountId: string;
  rating: string;
  date: Date;
};
export interface SaveRatingResult {
  save(data: SaveRatingResultParams): Promise<RatingResultModel>;
}

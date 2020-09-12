import { RatingResultModel } from '@/modules/rating/models/rating-result';

export type SaveRatingResultParams = {
  ratingId: string;
  ratingFor: string;
  accountId: string;
  rating: string;
  createdAt: Date;
};
export interface SaveRatingResult {
  save(data: SaveRatingResultParams): Promise<RatingResultModel>;
}

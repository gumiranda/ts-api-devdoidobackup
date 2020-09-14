import { RatingResultModel } from '@/modules/rating/models/rating-result';

export type SaveRatingResultParams = {
  ratingId: string;
  ratingFor: string;
  userId: string;
  rating: string;
  comment: string;
  createdAt: Date;
};
export interface SaveRatingResult {
  save(data: SaveRatingResultParams): Promise<RatingResultModel>;
}

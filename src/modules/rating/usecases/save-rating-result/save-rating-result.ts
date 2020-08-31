import { RatingResultModel } from '../../models/rating-result';

export type SaveRatingResultModel = Omit<RatingResultModel, '_id'>;
export interface SaveRatingResult {
  save(data: SaveRatingResultModel): Promise<SaveRatingResultModel>;
}

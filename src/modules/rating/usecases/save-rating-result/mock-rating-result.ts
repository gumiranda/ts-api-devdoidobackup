import { SaveRatingResult, SaveRatingResultParams } from './save-rating-result';
import { RatingResultModel } from '../../models/rating-result';
import { makeFakeRatingResult } from '../../models/mocks/mock-rating-result';

export const makeSaveRatingResult = (): SaveRatingResult => {
  class SaveRatingResultStub implements SaveRatingResult {
    async save(ratingData: SaveRatingResultParams): Promise<RatingResultModel> {
      return new Promise((resolve) => resolve(makeFakeRatingResult()));
    }
  }
  return new SaveRatingResultStub();
};

import { mockFakeRatingResult } from '../../models/mocks/mock-rating-result';
import { RatingResultModel } from '../../models/rating-result';
import { LoadRatingResult } from '../load-rating-result/load-rating-result';
import {
  SaveRatingResult,
  SaveRatingResultParams,
} from '../save-rating-result/save-rating-result';

export const mockLoadRatingResult = (): LoadRatingResult => {
  class LoadRatingResultStub implements LoadRatingResult {
    async load(ratingId: string): Promise<RatingResultModel> {
      return new Promise((resolve) => resolve(mockFakeRatingResult()));
    }
  }
  return new LoadRatingResultStub();
};
export const makeSaveRatingResult = (): SaveRatingResult => {
  class SaveRatingResultStub implements SaveRatingResult {
    async save(ratingData: SaveRatingResultParams): Promise<RatingResultModel> {
      return new Promise((resolve) => resolve(mockFakeRatingResult()));
    }
  }
  return new SaveRatingResultStub();
};

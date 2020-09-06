import { mockFakeRatingResult } from '@/modules/rating/models/mocks/mock-rating-result';
import { RatingResultModel } from '@/modules/rating/models/rating-result';
import { LoadRatingResult } from '@/modules/rating/usecases/load-rating-result/load-rating-result';
import {
  SaveRatingResult,
  SaveRatingResultParams,
} from '@/modules/rating/usecases/save-rating-result/save-rating-result';

export const mockLoadRatingResult = (): LoadRatingResult => {
  class LoadRatingResultStub implements LoadRatingResult {
    ratingId: string;
    ratingModel = mockFakeRatingResult();
    async load(ratingId: string): Promise<RatingResultModel> {
      this.ratingId = ratingId;
      return new Promise((resolve) => resolve(this.ratingModel));
    }
  }
  return new LoadRatingResultStub();
};
export const makeSaveRatingResult = (): SaveRatingResult => {
  class SaveRatingResultStub implements SaveRatingResult {
    ratingModel = mockFakeRatingResult();
    async save(ratingData: SaveRatingResultParams): Promise<RatingResultModel> {
      return new Promise((resolve) => resolve(this.ratingModel));
    }
  }
  return new SaveRatingResultStub();
};

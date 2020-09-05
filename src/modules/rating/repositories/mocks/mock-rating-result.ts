import { SaveRatingResultRepository } from '../rating-result/protocols/save-rating-result-repository';
import { SaveRatingResultParams } from '../../usecases/save-rating-result/save-rating-result';
import { LoadRatingResultRepository } from '../rating-result/protocols/load-rating-result-repository';
import { RatingResultModel } from '../../models/rating-result';
import { mockFakeRatingResult } from '../../models/mocks/mock-rating-result';

export const mockSaveRatingResultRepository = (): SaveRatingResultRepository => {
  class SaveRatingResultRepositoryStub implements SaveRatingResultRepository {
    ratingResultModel: SaveRatingResultParams;
    async save(data: SaveRatingResultParams): Promise<void> {
      this.ratingResultModel = data;
      return new Promise((resolve) => resolve());
    }
  }
  return new SaveRatingResultRepositoryStub();
};

export const mockLoadRatingResultRepository = (): LoadRatingResultRepository => {
  class LoadRatingResultRepositoryStub implements LoadRatingResultRepository {
    ratingId: string;
    ratingResultModel = mockFakeRatingResult();
    async loadByRatingId(ratingId: string): Promise<RatingResultModel> {
      this.ratingId = ratingId;
      return Promise.resolve(this.ratingResultModel);
    }
  }
  return new LoadRatingResultRepositoryStub();
};

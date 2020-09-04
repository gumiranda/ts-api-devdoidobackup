import { SaveRatingResultRepository } from '../rating-result/protocols/save-rating-result-repository';
import { SaveRatingResultParams } from '../../usecases/save-rating-result/save-rating-result';
import { LoadRatingResultRepository } from '../rating-result/protocols/load-rating-result-repository';
import { RatingResultModel } from '../../models/rating-result';
import { makeFakeRatingResult } from '../../models/mocks/mock-rating-result';

export const mockSaveRatingResultRepository = (): SaveRatingResultRepository => {
  class SaveRatingResultRepositoryStub implements SaveRatingResultRepository {
    async save(data: SaveRatingResultParams): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new SaveRatingResultRepositoryStub();
};

export const mockLoadRatingResultRepository = (): LoadRatingResultRepository => {
  class LoadRatingResultRepositoryStub implements LoadRatingResultRepository {
    async loadByRatingId(ratingId: string): Promise<RatingResultModel> {
      return Promise.resolve(makeFakeRatingResult());
    }
  }
  return new LoadRatingResultRepositoryStub();
};

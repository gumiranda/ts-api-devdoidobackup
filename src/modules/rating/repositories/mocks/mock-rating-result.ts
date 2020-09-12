import { SaveRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/save-rating-result-repository';
import { SaveRatingResultParams } from '@/modules/rating/usecases/save-rating-result/save-rating-result';
import { LoadRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/load-rating-result-repository';
import { RatingResultModel } from '@/modules/rating/models/rating-result';
import { mockFakeRatingResult } from '@/modules/rating/models/mocks/mock-rating-result';

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
    ratingFor: string;
    ratingResultModel = mockFakeRatingResult();
    async loadByRatingIdRatingFor(
      ratingId: string,
      ratingFor: string,
    ): Promise<RatingResultModel> {
      this.ratingId = ratingId;
      this.ratingFor = ratingFor;
      return Promise.resolve(this.ratingResultModel);
    }
  }
  return new LoadRatingResultRepositoryStub();
};

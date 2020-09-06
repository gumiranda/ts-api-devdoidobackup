import { LoadRatingByIdRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-by-id-repository';
import { RatingModel } from '@/modules/rating/models/rating';
import {
  mockFakeRatingWithIdFake,
  mockFakeRatings,
} from '@/modules/rating/models/mocks/mock-rating';
import { AddRatingRepository } from '@/modules/rating/repositories/rating/protocols/add-rating-repository';
import { AddRatingModel } from '@/modules/rating/usecases/add-rating/add-rating';
import { LoadRatingRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-repository';

export const mockLoadRatingByIdRepository = (): LoadRatingByIdRepository => {
  class LoadRatingByIdRepositoryStub implements LoadRatingByIdRepository {
    _id: string;
    ratingModel: RatingModel;
    loadById(_id: string): Promise<RatingModel> {
      this._id = _id;
      this.ratingModel = mockFakeRatingWithIdFake(_id);
      return new Promise((resolve) => resolve(this.ratingModel));
    }
  }
  return new LoadRatingByIdRepositoryStub();
};

export const mockAddRatingRepository = (): AddRatingRepository => {
  class AddRatingRepositoryStub implements AddRatingRepository {
    add(ratingData: AddRatingModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddRatingRepositoryStub();
};
export const mockLoadRatingRepository = (): LoadRatingRepository => {
  class LoadRatingRepositoryStub implements LoadRatingRepository {
    callsCount = 0;
    ratingModels = mockFakeRatings();
    loadAll(): Promise<RatingModel[]> {
      this.callsCount++;
      return new Promise((resolve) => resolve(this.ratingModels));
    }
  }
  return new LoadRatingRepositoryStub();
};

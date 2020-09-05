import { LoadRatingByIdRepository } from '../rating/protocols/load-rating-by-id-repository';
import { RatingModel } from '../../models/rating';
import {
  mockFakeRatingWithIdFake,
  mockFakeRatings,
} from '../../models/mocks/mock-rating';
import { AddRatingRepository } from '../rating/protocols/add-rating-repository';
import { AddRatingModel } from '../../usecases/add-rating/add-rating';
import { LoadRatingRepository } from '../rating/protocols/load-rating-repository';

export const mockLoadRatingByIdRepository = (): LoadRatingByIdRepository => {
  class LoadRatingByIdRepositoryStub implements LoadRatingByIdRepository {
    loadById(_id: string): Promise<RatingModel> {
      return new Promise((resolve) => resolve(mockFakeRatingWithIdFake()));
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
    loadAll(): Promise<RatingModel[]> {
      return new Promise((resolve) => resolve(mockFakeRatings()));
    }
  }
  return new LoadRatingRepositoryStub();
};

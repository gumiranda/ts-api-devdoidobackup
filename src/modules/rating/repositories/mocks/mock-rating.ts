import { LoadRatingByIdRepository } from '../rating/protocols/load-rating-by-id-repository';
import { RatingModel } from '../../models/rating';
import {
  makeFakeRatingWithIdFake,
  makeFakeRatings,
} from '../../models/mocks/mock-rating';
import { AddRatingRepository } from '../rating/protocols/add-rating-repository';
import { AddRatingModel } from '../../usecases/add-rating/add-rating';
import { LoadRatingRepository } from '../rating/protocols/load-rating-repository';

export const makeLoadRatingByIdRepository = (): LoadRatingByIdRepository => {
  class LoadRatingByIdRepositoryStub implements LoadRatingByIdRepository {
    loadById(_id: string): Promise<RatingModel> {
      return new Promise((resolve) => resolve(makeFakeRatingWithIdFake()));
    }
  }
  return new LoadRatingByIdRepositoryStub();
};

export const makeAddRatingRepository = (): AddRatingRepository => {
  class AddRatingRepositoryStub implements AddRatingRepository {
    add(ratingData: AddRatingModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddRatingRepositoryStub();
};
export const makeLoadRatingRepository = (): LoadRatingRepository => {
  class LoadRatingRepositoryStub implements LoadRatingRepository {
    loadAll(): Promise<RatingModel[]> {
      return new Promise((resolve) => resolve(makeFakeRatings()));
    }
  }
  return new LoadRatingRepositoryStub();
};

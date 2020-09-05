import { AddRating, AddRatingModel } from '../add-rating/add-rating';
import { LoadRating } from '../load-rating/load-rating';
import { RatingModel } from '../../models/rating';
import {
  mockFakeRatings,
  mockFakeRating,
} from '../../models/mocks/mock-rating';
import { LoadRatingById } from '../load-rating-by-id/load-rating-by-id';

export const mockAddRating = (): AddRating => {
  class AddRatingStub implements AddRating {
    async add(data: AddRatingModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddRatingStub();
};

export const mockLoadRating = (): LoadRating => {
  class LoadRatingStub implements LoadRating {
    async load(): Promise<RatingModel[]> {
      return new Promise((resolve) => resolve(mockFakeRatings()));
    }
  }
  return new LoadRatingStub();
};
export const mockLoadRatingById = (): LoadRatingById => {
  class LoadRatingByIdStub implements LoadRatingById {
    async loadById(_id: string): Promise<RatingModel> {
      return new Promise((resolve) => resolve(mockFakeRating()));
    }
  }
  return new LoadRatingByIdStub();
};

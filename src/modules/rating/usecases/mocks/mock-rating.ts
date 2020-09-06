import {
  AddRating,
  AddRatingModel,
} from '@/modules/rating/usecases/add-rating/add-rating';
import { LoadRating } from '@/modules/rating/usecases/load-rating/load-rating';
import { RatingModel } from '@/modules/rating/models/rating';
import {
  mockFakeRatings,
  mockFakeRating,
} from '@/modules/rating/models/mocks/mock-rating';
import { LoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/load-rating-by-id';

export const mockAddRating = (): AddRating => {
  class AddRatingStub implements AddRating {
    ratingModel: AddRatingModel;
    async add(data: AddRatingModel): Promise<void> {
      this.ratingModel = data;
      return new Promise((resolve) => resolve());
    }
  }
  return new AddRatingStub();
};

export const mockLoadRating = (): LoadRating => {
  class LoadRatingStub implements LoadRating {
    ratingsModel = mockFakeRatings();
    async load(): Promise<RatingModel[]> {
      return new Promise((resolve) => resolve(this.ratingsModel));
    }
  }
  return new LoadRatingStub();
};
export const mockLoadRatingById = (): LoadRatingById => {
  class LoadRatingByIdStub implements LoadRatingById {
    ratingModel = mockFakeRating();
    _id: string;
    async loadById(_id: string): Promise<RatingModel> {
      this._id = _id;
      return new Promise((resolve) => resolve(this.ratingModel));
    }
  }
  return new LoadRatingByIdStub();
};

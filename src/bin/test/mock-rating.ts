import {
  AddRating,
  AddRatingModel,
} from '@/modules/rating/usecases/add-rating/add-rating';
import { RatingModel } from '@/modules/rating/models/rating';
import { LoadRating } from '@/modules/rating/usecases/load-rating/load-rating';
import { LoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/load-rating-by-id';
import { RatingResultModel } from '@/modules/rating/models/rating-result';
import { SaveRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/save-rating-result-repository';
import {
  SaveRatingResult,
  SaveRatingResultParams,
} from '@/modules/rating/usecases/save-rating-result/save-rating-result';
import { LoadRatingByIdRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-by-id-repository';
import { AddRatingRepository } from '@/modules/rating/repositories/rating/protocols/add-rating-repository';
import { LoadRatingRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-repository';
import { LoadRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/load-rating-result-repository';

export const makeAddRating = (): AddRating => {
  class AddRatingStub implements AddRating {
    async add(data: AddRatingModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddRatingStub();
};
export const makeFakeRatings = (): RatingModel[] => {
  return [
    {
      ratingType: 'atendimento',
      _id: 'any_id',
      date: new Date(),
      ratings: [
        {
          rating: 'Bom',
          stars: 3,
        },
      ],
    },
    {
      ratingType: 'educação',
      _id: 'other_id',
      date: new Date(),
      ratings: [
        {
          rating: 'Bom',
          stars: 3,
        },
      ],
    },
  ];
};
export const makeLoadRating = (): LoadRating => {
  class LoadRatingStub implements LoadRating {
    async load(): Promise<RatingModel[]> {
      return new Promise((resolve) => resolve(makeFakeRatings()));
    }
  }
  return new LoadRatingStub();
};
export const makeLoadRatingById = (): LoadRatingById => {
  class LoadRatingByIdStub implements LoadRatingById {
    async loadById(_id: string): Promise<RatingModel> {
      return new Promise((resolve) => resolve(makeFakeRating()));
    }
  }
  return new LoadRatingByIdStub();
};
export const makeFakeRating = (): RatingModel => ({
  ratingType: 'any_entity',
  _id: 'any_id',
  date: new Date(),
  ratings: [
    {
      rating: 'Bom',
      stars: 3,
    },
  ],
});
export const makeFakeRatingWithIdFake = (): RatingModel => ({
  _id: '5f4d46d97568f749c8f5a8e9',
  ratingType: 'atendimento',
  date: new Date(),
  ratings: [
    {
      rating: 'Bom',
      stars: 3,
    },
  ],
});
export const makeFakeAddRating = (): Omit<RatingModel, '_id'> => ({
  ratingType: 'atendimento',
  date: new Date(),
  ratings: [
    {
      rating: 'Bom',
      stars: 3,
    },
    {
      rating: 'Ótimo',
      stars: 4,
    },
  ],
});
export const makeFakeRatingResult = (): RatingResultModel => ({
  ratingId: 'any_rating_id',
  ratingType: 'any_ratingType',
  date: new Date(),
  ratings: [
    {
      rating: 'any_rating',
      stars: 3,
      count: 1,
      percent: 50,
    },
    {
      rating: 'other_rating',
      stars: 3,
      count: 10,
      percent: 80,
    },
  ],
});
export const makeFakeRatingResultData = (
  ratingId: string,
  accountId: string,
  rating: string,
): SaveRatingResultParams => ({
  ratingId,
  accountId,
  rating,
  date: new Date(),
});

export const makeLoadRatingByIdRepository = (): LoadRatingByIdRepository => {
  class LoadRatingByIdRepositoryStub implements LoadRatingByIdRepository {
    loadById(_id: string): Promise<RatingModel> {
      return new Promise((resolve) => resolve(makeFakeRatingWithIdFake()));
    }
  }
  return new LoadRatingByIdRepositoryStub();
};
export const makeFakeAddRatingResult = (
  ratingId: string,
): Omit<RatingResultModel, '_id'> => ({
  ratingId,
  ratingType: 'atendimento',
  ratings: [
    {
      rating: 'Bom',
      stars: 3,
      count: 10,
      percent: 50,
    },
  ],
  date: new Date(),
});
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
export const makeSaveRatingResult = (): SaveRatingResult => {
  class SaveRatingResultStub implements SaveRatingResult {
    async save(ratingData: SaveRatingResultParams): Promise<RatingResultModel> {
      return new Promise((resolve) => resolve(makeFakeRatingResult()));
    }
  }
  return new SaveRatingResultStub();
};

export const mockRatingResultModel = (): RatingResultModel => ({
  ratingId: 'any_rating_id',
  ratingType: 'any_ratingType',
  ratings: [
    {
      rating: 'any_rating',
      stars: 3,
      count: 1,
      percent: 50,
    },
    {
      rating: 'other_rating',
      stars: 3,
      count: 10,
      percent: 80,
    },
  ],
  date: new Date(),
});
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
      return Promise.resolve(mockRatingResultModel());
    }
  }
  return new LoadRatingResultRepositoryStub();
};

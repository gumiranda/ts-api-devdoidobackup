import { DbLoadRating } from './db-load-rating';
import MockDate from 'mockdate';
import { RatingModel } from '../../../models/rating';
import { LoadRatingRepository } from '../../../repositories/protocols/load-rating-repository';
type SutTypes = {
  sut: DbLoadRating;
  loadRatingStub: LoadRatingRepository;
};
const makeFakeRating = (): RatingModel[] => {
  return [
    {
      ratingFor: 'any_entity',
      _id: 'any_id',
      date: new Date(),
      ratings: [{ ratingType: 'any_ratingtype', obs: 'any_rating', stars: 3 }],
    },
    {
      ratingFor: 'other_entity',
      _id: 'other_id',
      date: new Date(),
      ratings: [
        { ratingType: 'other_ratingtype', obs: 'other_rating', stars: 3 },
      ],
    },
  ];
};
const makeLoadRatingRepository = (): LoadRatingRepository => {
  class LoadRatingRepositoryStub implements LoadRatingRepository {
    loadAll(): Promise<RatingModel[]> {
      return new Promise((resolve) => resolve(makeFakeRating()));
    }
  }
  return new LoadRatingRepositoryStub();
};
const makeSut = (): SutTypes => {
  const loadRatingStub = makeLoadRatingRepository();
  const sut = new DbLoadRating(loadRatingStub);
  return {
    sut,
    loadRatingStub,
  };
};
describe('DbLoadRating', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call LoadRatingRepository with correct values', async () => {
    const { sut, loadRatingStub } = makeSut();
    const loadRatingSpy = jest.spyOn(loadRatingStub, 'loadAll');
    await sut.load();
    expect(loadRatingSpy).toHaveBeenCalledWith();
  });
  test('should return a list of ratings on success', async () => {
    const { sut } = makeSut();
    const ratings = await sut.load();
    expect(ratings).toEqual(makeFakeRating());
  });
  test('should throw if LoadRatingRepository throws', async () => {
    const { sut, loadRatingStub } = makeSut();
    jest
      .spyOn(loadRatingStub, 'loadAll')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});

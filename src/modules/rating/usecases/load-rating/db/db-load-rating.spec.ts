import { DbLoadRating } from '@/modules/rating/usecases/load-rating/db/db-load-rating';
import MockDate from 'mockdate';
import { LoadRatingRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-repository';
import { mockFakeRatings } from '@/modules/rating/models/mocks/mock-rating';
import { mockLoadRatingRepository } from '@/modules/rating/repositories/mocks/mock-rating';

type SutTypes = {
  sut: DbLoadRating;
  loadRatingStub: LoadRatingRepository;
};

const makeSut = (): SutTypes => {
  const loadRatingStub = mockLoadRatingRepository();
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
    expect(ratings).toEqual(mockFakeRatings());
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

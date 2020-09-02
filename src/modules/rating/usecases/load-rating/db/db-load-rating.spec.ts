import { DbLoadRating } from './db-load-rating';
import MockDate from 'mockdate';
import { LoadRatingRepository } from '../../../repositories/rating/protocols/load-rating-repository';
import {
  makeFakeRatings,
  makeLoadRatingRepository,
} from '@/bin/test/mock-rating';
type SutTypes = {
  sut: DbLoadRating;
  loadRatingStub: LoadRatingRepository;
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
    expect(ratings).toEqual(makeFakeRatings());
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

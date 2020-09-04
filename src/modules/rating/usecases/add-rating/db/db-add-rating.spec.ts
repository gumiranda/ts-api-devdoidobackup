import { DbAddRating } from './db-add-rating';
import { AddRatingRepository } from '../../../repositories/rating/protocols/add-rating-repository';
import MockDate from 'mockdate';
import { makeFakeRating } from '@/modules/rating/models/mocks/mock-rating';
import { makeAddRatingRepository } from '@/modules/rating/repositories/mocks/mock-rating';

type SutTypes = {
  sut: DbAddRating;
  addRatingStub: AddRatingRepository;
};

const makeSut = (): SutTypes => {
  const addRatingStub = makeAddRatingRepository();
  const sut = new DbAddRating(addRatingStub);
  return {
    sut,
    addRatingStub,
  };
};
describe('DbAddRating', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  beforeAll(() => {
    MockDate.reset();
  });
  test('should call AddRatingRepository with correct values', async () => {
    const { sut, addRatingStub } = makeSut();
    const ratingData = makeFakeRating();
    const addRatingSpy = jest.spyOn(addRatingStub, 'add');
    await sut.add(ratingData);
    expect(addRatingSpy).toHaveBeenCalledWith(ratingData);
  });
  test('should throw if AddRatingRepository throws', async () => {
    const { sut, addRatingStub } = makeSut();
    const ratingData = makeFakeRating();
    jest
      .spyOn(addRatingStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(ratingData);
    await expect(promise).rejects.toThrow();
  });
});

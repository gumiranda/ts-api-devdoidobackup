import MockDate from 'mockdate';
import { LoadRatingByIdRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-by-id-repository';
import { DbLoadRatingById } from './db-load-rating-by-id';
import { mockFakeRatingWithIdFake } from '@/modules/rating/models/mocks/mock-rating';
import { mockLoadRatingByIdRepository } from '@/modules/rating/repositories/mocks/mock-rating';
type SutTypes = {
  sut: DbLoadRatingById;
  loadRatingStub: LoadRatingByIdRepository;
};
const makeSut = (): SutTypes => {
  const loadRatingStub = mockLoadRatingByIdRepository();
  const sut = new DbLoadRatingById(loadRatingStub);
  return {
    sut,
    loadRatingStub,
  };
};
describe('DbLoadRatingById', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call LoadRatingByIdRepository with correct values', async () => {
    const { sut, loadRatingStub } = makeSut();
    const loadRatingSpy = jest.spyOn(loadRatingStub, 'loadById');
    await sut.loadById('5f4d46d97568f749c8f5a8e9');
    expect(loadRatingSpy).toHaveBeenCalledWith('5f4d46d97568f749c8f5a8e9');
  });
  test('should return rating on success', async () => {
    const { sut } = makeSut();
    const ratings = await sut.loadById('5f4d46d97568f749c8f5a8e9');
    expect(ratings).toEqual(mockFakeRatingWithIdFake());
  });
  test('should throw if LoadRatingByIdRepository throws', async () => {
    const { sut, loadRatingStub } = makeSut();
    jest
      .spyOn(loadRatingStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadById('5f4d46d97568f749c8f5a8e9');
    await expect(promise).rejects.toThrow();
  });
});

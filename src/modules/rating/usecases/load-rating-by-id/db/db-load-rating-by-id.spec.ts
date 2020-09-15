import MockDate from 'mockdate';
import { LoadRatingByIdRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-by-id-repository';
import { DbLoadRatingById } from './db-load-rating-by-id';
import { mockFakeRatingWithIdFake } from '@/modules/rating/models/mocks/mock-rating';
import { mockLoadRatingByIdRepository } from '@/modules/rating/repositories/mocks/mock-rating';
import faker from 'faker-br';
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
let _id: string;
describe('DbLoadRatingById', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  beforeEach(() => {
    _id = faker.random.uuid();
  });
  test('should call LoadRatingByIdRepository with correct values', async () => {
    const { sut, loadRatingStub } = makeSut();
    const loadRatingSpy = jest.spyOn(loadRatingStub, 'loadById');
    await sut.loadById(_id);
    expect(loadRatingSpy).toHaveBeenCalledWith(_id);
  });
  test('should return rating on success', async () => {
    const { sut, loadRatingStub } = makeSut();
    const ratings = await sut.loadById(_id);
    expect(ratings).toEqual(loadRatingStub.ratingModel);
  });
  test('should throw if LoadRatingByIdRepository throws', async () => {
    const { sut, loadRatingStub } = makeSut();
    jest
      .spyOn(loadRatingStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadById(_id);
    await expect(promise).rejects.toThrow();
  });
});

import { DbLoadRatingResult } from './db-load-rating-result';
import { LoadRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/load-rating-result-repository';
import { LoadRatingByIdRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-by-id-repository';
import { mockLoadRatingResultRepository } from '@/modules/rating/repositories/mocks/mock-rating-result';
import { mockLoadRatingByIdRepository } from '@/modules/rating/repositories/mocks/mock-rating';
import MockDate from 'mockdate';
import faker from 'faker-br';
type SutTypes = {
  sut: DbLoadRatingResult;
  loadRatingResultRepositoryStub: LoadRatingResultRepository;
  loadRatingByIdRepositoryStub: LoadRatingByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadRatingResultRepositoryStub = mockLoadRatingResultRepository();
  const loadRatingByIdRepositoryStub = mockLoadRatingByIdRepository();
  const sut = new DbLoadRatingResult(
    loadRatingResultRepositoryStub,
    loadRatingByIdRepositoryStub,
  );
  return {
    sut,
    loadRatingResultRepositoryStub,
    loadRatingByIdRepositoryStub,
  };
};
let ratingId: string;
let ratingFor: string;
describe('DbLoadRatingResult UseCase', () => {
  beforeEach(() => {
    ratingId = faker.random.uuid();
    ratingFor = faker.random.uuid();
  });
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('Should call LoadRatingResultRepository', async () => {
    const { sut, loadRatingResultRepositoryStub } = makeSut();
    await sut.load(ratingId, ratingFor);
    expect(loadRatingResultRepositoryStub.ratingId).toBe(ratingId);
    expect(loadRatingResultRepositoryStub.ratingFor).toBe(ratingFor);
  });

  test('Should throw if LoadRatingResultRepository throws', async () => {
    const { sut, loadRatingResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadRatingResultRepositoryStub, 'loadByRatingIdRatingFor')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.load(ratingId, ratingFor);
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadRatingByIdRepository if LoadRatingResultRepository returns null', async () => {
    const {
      sut,
      loadRatingResultRepositoryStub,
      loadRatingByIdRepositoryStub,
    } = makeSut();
    loadRatingResultRepositoryStub.ratingResultModel = null;
    await sut.load(ratingId, ratingFor);
    expect(loadRatingByIdRepositoryStub._id).toBe(ratingId);
  });
  test('Should call LoadRatingByIdRepository with all ratings with count 0 if LoadRatingResultRepository returns null', async () => {
    const {
      sut,
      loadRatingResultRepositoryStub,
      loadRatingByIdRepositoryStub,
    } = makeSut();
    loadRatingResultRepositoryStub.ratingResultModel = null;
    const ratingResult = await sut.load(ratingId, ratingFor);
    const { ratingModel } = loadRatingByIdRepositoryStub;
    expect(ratingResult).toEqual({
      ratingId: ratingModel._id,
      ratingType: ratingModel.ratingType,
      createdAt: ratingModel.createdAt,
      ratingFor,
      ratings: ratingModel.ratings.map((rating) =>
        Object.assign({}, rating, { count: 0, comment: '', percent: 0 }),
      ),
    });
  });

  test('Should return ratingResultModel on success', async () => {
    const { sut, loadRatingResultRepositoryStub } = makeSut();
    const ratingResult = await sut.load(ratingId, ratingFor);
    expect(ratingResult).toEqual(
      loadRatingResultRepositoryStub.ratingResultModel,
    );
  });
});

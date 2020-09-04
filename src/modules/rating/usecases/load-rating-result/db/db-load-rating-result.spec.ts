import { DbLoadRatingResult } from './db-load-rating-result';
import { LoadRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/load-rating-result-repository';
import { LoadRatingByIdRepository } from '@/modules/rating/repositories/rating/protocols/load-rating-by-id-repository';
import { mockLoadRatingResultRepository } from '@/modules/rating/repositories/mocks/mock-rating-result';
import { makeFakeRatingResult } from '@/modules/rating/models/mocks/mock-rating-result';
import { makeLoadRatingByIdRepository } from '@/modules/rating/repositories/mocks/mock-rating';

type SutTypes = {
  sut: DbLoadRatingResult;
  loadRatingResultRepositoryStub: LoadRatingResultRepository;
  loadRatingByIdRepositoryStub: LoadRatingByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadRatingResultRepositoryStub = mockLoadRatingResultRepository();
  const loadRatingByIdRepositoryStub = makeLoadRatingByIdRepository();
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

describe('DbLoadRatingResult UseCase', () => {
  test('Should call LoadRatingResultRepository', async () => {
    const { sut, loadRatingResultRepositoryStub } = makeSut();
    const loadByRatingIdSpy = jest.spyOn(
      loadRatingResultRepositoryStub,
      'loadByRatingId',
    );
    await sut.load('any_rating_id');
    expect(loadByRatingIdSpy).toHaveBeenCalledWith('any_rating_id');
  });

  test('Should throw if LoadRatingResultRepository throws', async () => {
    const { sut, loadRatingResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadRatingResultRepositoryStub, 'loadByRatingId')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.load('any_rating_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadRatingByIdRepository if LoadRatingResultRepository returns null', async () => {
    const {
      sut,
      loadRatingResultRepositoryStub,
      loadRatingByIdRepositoryStub,
    } = makeSut();
    const loadByIdSpy = jest.spyOn(loadRatingByIdRepositoryStub, 'loadById');
    jest
      .spyOn(loadRatingResultRepositoryStub, 'loadByRatingId')
      .mockReturnValueOnce(Promise.resolve(null));
    await sut.load('any_rating_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_rating_id');
  });

  test('Should return ratingResultModel on success', async () => {
    const { sut } = makeSut();
    const ratingResult = await sut.load('any_rating_id');
    expect(ratingResult).toEqual(makeFakeRatingResult());
  });
});

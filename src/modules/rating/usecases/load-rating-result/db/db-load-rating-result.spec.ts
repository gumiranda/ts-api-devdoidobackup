import MockDate from 'mockdate';
import { DbSaveRatingResult } from '../../save-rating-result/db/db-save-rating-result';
import { SaveRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/save-rating-result-repository';
import { LoadRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/load-rating-result-repository';
import {
  mockSaveRatingResultRepository,
  mockLoadRatingResultRepository,
  makeFakeRatingResultData,
  mockRatingResultModel,
} from '@/bin/test/mock-rating';

type SutTypes = {
  sut: DbSaveRatingResult;
  saveRatingResultRepositoryStub: SaveRatingResultRepository;
  loadRatingResultRepositoryStub: LoadRatingResultRepository;
};

const makeSut = (): SutTypes => {
  const saveRatingResultRepositoryStub = mockSaveRatingResultRepository();
  const loadRatingResultRepositoryStub = mockLoadRatingResultRepository();
  const sut = new DbSaveRatingResult(
    saveRatingResultRepositoryStub,
    loadRatingResultRepositoryStub,
  );
  return {
    sut,
    saveRatingResultRepositoryStub,
    loadRatingResultRepositoryStub,
  };
};

describe('DbSaveRatingResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call SaveRatingResultRepository with correct values', async () => {
    const { sut, saveRatingResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveRatingResultRepositoryStub, 'save');
    const ratingResultData = makeFakeRatingResultData(
      'any_rating_id',
      'any_account_id',
      'Bom',
    );
    await sut.save(ratingResultData);
    expect(saveSpy).toHaveBeenCalledWith(ratingResultData);
  });

  test('Should throw if SaveRatingResultRepository throws', async () => {
    const { sut, saveRatingResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveRatingResultRepositoryStub, 'save')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.save(
      makeFakeRatingResultData('any_rating_id', 'any_account_id', 'Bom'),
    );
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadRatingResultRepository with correct values', async () => {
    const { sut, loadRatingResultRepositoryStub } = makeSut();
    const loadByRatingIdSpy = jest.spyOn(
      loadRatingResultRepositoryStub,
      'loadByRatingId',
    );
    const ratingResultData = makeFakeRatingResultData(
      'any_rating_id',
      'any_account_id',
      'Bom',
    );
    await sut.save(ratingResultData);
    expect(loadByRatingIdSpy).toHaveBeenCalledWith(ratingResultData.ratingId);
  });

  test('Should throw if LoadRatingResultRepository throws', async () => {
    const { sut, loadRatingResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadRatingResultRepositoryStub, 'loadByRatingId')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.save(
      makeFakeRatingResultData('any_rating_id', 'any_account_id', 'Bom'),
    );
    await expect(promise).rejects.toThrow();
  });

  test('Should return RatingResult on success', async () => {
    const { sut } = makeSut();
    const ratingResult = await sut.save(
      makeFakeRatingResultData('any_rating_id', 'any_account_id', 'Bom'),
    );
    expect(ratingResult).toEqual(mockRatingResultModel());
  });
});

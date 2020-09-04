import { DbSaveRatingResult } from './db-save-rating-result';
import MockDate from 'mockdate';
import { SaveRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/save-rating-result-repository';

import { LoadRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/load-rating-result-repository';
import {
  makeFakeRatingResultData,
  makeFakeRatingResult,
} from '@/modules/rating/models/mocks/mock-rating-result';
import {
  mockSaveRatingResultRepository,
  mockLoadRatingResultRepository,
} from '@/modules/rating/repositories/mocks/mock-rating-result';

type SutTypes = {
  sut: DbSaveRatingResult;
  saveRatingStub: SaveRatingResultRepository;
  loadRatingStub: LoadRatingResultRepository;
};

const makeSut = (): SutTypes => {
  const saveRatingStub = mockSaveRatingResultRepository();
  const loadRatingStub = mockLoadRatingResultRepository();
  const sut = new DbSaveRatingResult(saveRatingStub, loadRatingStub);
  return {
    sut,
    saveRatingStub,
    loadRatingStub,
  };
};
describe('DbSaveRatingResult', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call SaveRatingResultRepository with correct values', async () => {
    const { sut, saveRatingStub } = makeSut();
    const data = makeFakeRatingResultData(
      'any_rating_id',
      'any_account_id',
      'Bom',
    );
    const saveRatingSpy = jest.spyOn(saveRatingStub, 'save');
    await sut.save(data);
    expect(saveRatingSpy).toHaveBeenCalledWith(data);
  });
  test('should throw if SaveRatingResultRepository throws', async () => {
    const { sut, saveRatingStub } = makeSut();
    const data = makeFakeRatingResultData(
      'any_rating_id',
      'any_account_id',
      'Bom',
    );
    jest
      .spyOn(saveRatingStub, 'save')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.save(data);
    await expect(promise).rejects.toThrow();
  });
  test('should return rating on success', async () => {
    const { sut } = makeSut();
    const ratings = await sut.save(
      makeFakeRatingResultData('any_rating_id', 'any_account_id', 'any_rating'),
    );
    expect(ratings).toEqual(makeFakeRatingResult());
  });
});

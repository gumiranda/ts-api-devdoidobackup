import { DbSaveRatingResult } from './db-save-rating-result';
import MockDate from 'mockdate';
import { SaveRatingResultRepository } from '@/modules/rating/repositories/rating-result/protocols/save-rating-result-repository';
import {
  makeFakeRatingResult,
  makeFakeRatingResultData,
  makeSaveRatingResultRepository,
} from '@/bin/test/mock-rating';

type SutTypes = {
  sut: DbSaveRatingResult;
  saveRatingStub: SaveRatingResultRepository;
};

const makeSut = (): SutTypes => {
  const saveRatingStub = makeSaveRatingResultRepository();
  const sut = new DbSaveRatingResult(saveRatingStub);
  return {
    sut,
    saveRatingStub,
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
    const data = makeFakeRatingResult();
    const saveRatingSpy = jest.spyOn(saveRatingStub, 'save');
    await sut.save(data);
    expect(saveRatingSpy).toHaveBeenCalledWith(data);
  });
  test('should throw if SaveRatingResultRepository throws', async () => {
    const { sut, saveRatingStub } = makeSut();
    const data = makeFakeRatingResult();
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
    const ratings = await sut.save(makeFakeRatingResultData());
    expect(ratings).toEqual(makeFakeRatingResult());
  });
});

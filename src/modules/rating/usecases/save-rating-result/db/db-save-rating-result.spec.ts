import MockDate from 'mockdate';
import { DbSaveRatingResult } from './db-save-rating-result';
import { SaveRatingResultRepository } from '@/modules/rating/repositories/rating/protocols/save-rating-result-repository';
import { SaveRatingResultModel } from '../save-rating-result';
import { RatingResultModel } from '@/modules/rating/models/rating-result';

type SutTypes = {
  sut: DbSaveRatingResult;
  saveRatingStub: SaveRatingResultRepository;
};
const makeFakeRatingResult = (): RatingResultModel => ({
  accountId: 'any_account_id',
  ratingId: 'any_rating_id',
  result: 'any_result',
  _id: 'any_id',
  date: new Date(),
});
const makeFakeRatingResultData = (): Omit<RatingResultModel, '_id'> =>
  Object.assign({}, makeFakeRatingResult(), { _id: 'any_id' });

const makeSaveRatingResultRepository = (): SaveRatingResultRepository => {
  class SaveRatingResultRepositoryStub implements SaveRatingResultRepository {
    save(data: SaveRatingResultModel): Promise<RatingResultModel> {
      return new Promise((resolve) => resolve(makeFakeRatingResult()));
    }
  }
  return new SaveRatingResultRepositoryStub();
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
  beforeAll(() => {
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

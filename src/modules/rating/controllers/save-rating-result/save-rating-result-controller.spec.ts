import { SaveRatingResult } from '../../usecases/save-rating-result/save-rating-result';
import { HttpRequest } from '@/bin/protocols/http';
import { forbidden, serverError, ok } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { SaveRatingResultController } from './save-rating-result-controller';
import { RatingResultModel } from '../../models/rating-result';
import { LoadRatingById } from '../../usecases/load-rating-by-id/load-rating-by-id';
import { RatingModel } from '../../models/rating';
import { InvalidParamError } from '@/bin/errors';

type SutTypes = {
  sut: SaveRatingResultController;
  loadRatingByIdStub: LoadRatingById;
  saveRatingStub: SaveRatingResult;
};
const makeSaveRatingResult = (): SaveRatingResult => {
  class SaveRatingResultStub implements SaveRatingResult {
    save(data: RatingResultModel): Promise<RatingResultModel> {
      return new Promise((resolve) => resolve(makeFakeRatingResult()));
    }
  }
  return new SaveRatingResultStub();
};
const makeFakeRating = (): RatingModel => ({
  ratingFor: 'any_entity',
  _id: 'any_id',
  date: new Date(),
  ratings: [{ ratingType: 'any_ratingtype', obs: 'any_rating', stars: 3 }],
});
const makeFakeRatingResult = (): RatingResultModel => ({
  ratingId: 'any_rating_id',
  _id: 'any_id',
  accountId: 'any_account_id',
  date: new Date(),
  result: 'result',
});

const makeLoadRatingById = (): LoadRatingById => {
  class LoadRatingByIdStub implements LoadRatingById {
    async loadById(_id: string): Promise<RatingModel> {
      return new Promise((resolve) => resolve(makeFakeRating()));
    }
  }
  return new LoadRatingByIdStub();
};
const makeSut = (): SutTypes => {
  const loadRatingByIdStub = makeLoadRatingById();
  const saveRatingStub = makeSaveRatingResult();
  const sut = new SaveRatingResultController(
    loadRatingByIdStub,
    saveRatingStub,
  );
  return { sut, loadRatingByIdStub, saveRatingStub };
};
const makeFakeRequest = (): HttpRequest => ({
  params: {
    ratingId: 'any_rating_id',
  },
  body: {
    result: 'result',
  },
  accountId: 'any_account_id',
});
describe('SaveRatingResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call LoadRatingById with correct values', async () => {
    const { sut, loadRatingByIdStub } = makeSut();
    const loadRatingByIdSpy = jest.spyOn(loadRatingByIdStub, 'loadById');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(loadRatingByIdSpy).toHaveBeenCalledWith('any_rating_id');
  });
  test('should call SaveRatingResult with correct values', async () => {
    const { sut, saveRatingStub } = makeSut();
    const saveRatingSpy = jest.spyOn(saveRatingStub, 'save');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(saveRatingSpy).toHaveBeenCalledWith({
      ratingId: 'any_rating_id',
      accountId: 'any_account_id',
      result: 'result',
      date: new Date(),
    });
  });
  test('should return 403 if LoadRatingById returns null', async () => {
    const { sut, loadRatingByIdStub } = makeSut();
    jest
      .spyOn(loadRatingByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('ratingId')));
  });
  test('should return 500 if LoadRatingById throws', async () => {
    const { sut, loadRatingByIdStub } = makeSut();
    jest
      .spyOn(loadRatingByIdStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 500 if SaveRatingResult throws', async () => {
    const { sut, saveRatingStub } = makeSut();
    jest
      .spyOn(saveRatingStub, 'save')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 200 if SUCCESS', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeRatingResult()));
  });
});
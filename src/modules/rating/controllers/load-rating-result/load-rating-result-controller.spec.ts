import {
  serverError,
  noContent,
  ok,
  forbidden,
} from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { LoadRatingResultController } from './load-rating-result.controller';
import { HttpRequest } from '@/bin/protocols/http';
import { mockLoadRatingById } from '@/modules/rating/usecases/mocks/mock-rating';
import { LoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/load-rating-by-id';
import { InvalidParamError } from '@/bin/errors';
import { LoadRatingResult } from '@/modules/rating/usecases/load-rating-result/load-rating-result';
import { mockLoadRatingResult } from '@/modules/rating/usecases/mocks/mock-rating-result';
import { mockFakeRatings } from '@/modules/rating/models/mocks/mock-rating';
import { mockFakeRatingResult } from '@/modules/rating/models/mocks/mock-rating-result';
const makeFakeRequest = (): HttpRequest => ({
  params: {
    ratingId: 'any_id',
    ratingFor: 'any_id',
  },
});
type SutTypes = {
  sut: LoadRatingResultController;
  loadRatingByIdStub: LoadRatingById;
  loadRatingResultStub: LoadRatingResult;
};

const makeSut = (): SutTypes => {
  const loadRatingByIdStub = mockLoadRatingById();
  const loadRatingResultStub = mockLoadRatingResult();
  const sut = new LoadRatingResultController(
    loadRatingByIdStub,
    loadRatingResultStub,
  );
  return { sut, loadRatingByIdStub, loadRatingResultStub };
};

describe('LoadRatingResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call loadById with correct values', async () => {
    const { sut, loadRatingByIdStub } = makeSut();
    const loadSpy = jest.spyOn(loadRatingByIdStub, 'loadById');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_id');
  });
  test('should call load with correct values', async () => {
    const { sut, loadRatingResultStub } = makeSut();
    const loadSpy = jest.spyOn(loadRatingResultStub, 'load');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_id', 'any_id');
  });
  test('should return 403 if LoadRatingById returns null', async () => {
    const { sut, loadRatingByIdStub } = makeSut();
    jest
      .spyOn(loadRatingByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('ratingId')));
  });
  test('should return 500 if LoadRatingById throws', async () => {
    const { sut, loadRatingByIdStub } = makeSut();
    jest.spyOn(loadRatingByIdStub, 'loadById').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 500 if LoadRatingById throws', async () => {
    const { sut, loadRatingResultStub } = makeSut();
    jest.spyOn(loadRatingResultStub, 'load').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockFakeRatingResult()));
  });
});

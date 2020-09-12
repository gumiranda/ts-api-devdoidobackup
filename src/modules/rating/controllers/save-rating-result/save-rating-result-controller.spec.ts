import { SaveRatingResult } from '@/modules/rating/usecases/save-rating-result/save-rating-result';
import { HttpRequest } from '@/bin/protocols/http';
import { forbidden, serverError, ok } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { SaveRatingResultController } from './save-rating-result-controller';
import { LoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/load-rating-by-id';
import { InvalidParamError } from '@/bin/errors';
import { mockFakeRatingResult } from '@/modules/rating/models/mocks/mock-rating-result';
import { mockLoadRatingById } from '@/modules/rating/usecases/mocks/mock-rating';
import { makeSaveRatingResult } from '@/modules/rating/usecases/mocks/mock-rating-result';
import { LoadUserById } from '@/modules/user/usecases/load-user-by-id/load-user-by-id';
import { mockLoadUserById } from '@/modules/user/usecases/mocks/mock-user';

type SutTypes = {
  sut: SaveRatingResultController;
  loadRatingByIdStub: LoadRatingById;
  loadUserByIdStub: LoadUserById;
  saveRatingStub: SaveRatingResult;
};

const makeSut = (): SutTypes => {
  const loadRatingByIdStub = mockLoadRatingById();
  const loadUserByIdStub = mockLoadUserById();
  const saveRatingStub = makeSaveRatingResult();
  const sut = new SaveRatingResultController(
    loadRatingByIdStub,
    loadUserByIdStub,
    saveRatingStub,
  );
  return { sut, loadRatingByIdStub, loadUserByIdStub, saveRatingStub };
};
const makeFakeRequest = (): HttpRequest => ({
  params: {
    ratingId: 'any_rating_id',
    ratingFor: 'any_ratingFor',
  },
  body: {
    rating: 'Bom',
  },
  userId: 'any_user_id',
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
      ratingFor: 'any_ratingFor',
      userId: 'any_user_id',
      rating: 'Bom',
      createdAt: new Date(),
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
    expect(httpResponse).toEqual(ok(mockFakeRatingResult()));
  });
});

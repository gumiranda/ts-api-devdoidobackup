import { LoadRatingController } from './load-rating-controller';
import { serverError, noContent, ok } from '@/bin/helpers/http-helper';
import { LoadRating } from '@/modules/rating/usecases/load-rating/load-rating';
import MockDate from 'mockdate';
import { mockFakeRatings } from '@/modules/rating/models/mocks/mock-rating';
import { mockLoadRating } from '@/modules/rating/usecases/mocks/mock-rating';
type SutTypes = {
  sut: LoadRatingController;
  loadRatingStub: LoadRating;
};

const makeSut = (): SutTypes => {
  const loadRatingStub = mockLoadRating();
  const sut = new LoadRatingController(loadRatingStub);
  return { sut, loadRatingStub };
};

describe('LoadRating Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call Validation with correct values', async () => {
    const { sut, loadRatingStub } = makeSut();
    const loadSpy = jest.spyOn(loadRatingStub, 'load');
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalledWith();
  });
  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(mockFakeRatings()));
  });
  test('should return 204 if LoadRatings returns noContent', async () => {
    const { sut, loadRatingStub } = makeSut();
    jest
      .spyOn(loadRatingStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve([])));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });
  test('should return 500 if AddRating throws', async () => {
    const { sut, loadRatingStub } = makeSut();
    jest
      .spyOn(loadRatingStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});

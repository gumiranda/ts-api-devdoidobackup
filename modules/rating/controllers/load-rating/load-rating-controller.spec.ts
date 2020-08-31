import { HttpRequest, HttpResponse } from '../../../../bin/protocols/http';
import { LoadRatingController } from './load-rating-controller';
import {
  badRequest,
  serverError,
  noContent,
  ok,
} from '../../../../bin/helpers/http-helper';
import { LoadRating } from '../../usecases/load-rating/load-rating';
import MockDate from 'mockdate';
import { RatingModel } from '../../models/rating';
interface SutTypes {
  sut: LoadRatingController;
  loadRatingStub: LoadRating;
}
const makeLoadRating = (): LoadRating => {
  class LoadRatingStub implements LoadRating {
    async load(): Promise<RatingModel[]> {
      return new Promise((resolve) => resolve(makeFakeRating()));
    }
  }
  return new LoadRatingStub();
};
const makeSut = (): SutTypes => {
  const loadRatingStub = makeLoadRating();
  const sut = new LoadRatingController(loadRatingStub);
  return { sut, loadRatingStub };
};
const makeFakeRating = (): RatingModel[] => {
  return [
    {
      ratingFor: 'any_entity',
      _id: 'any_id',
      date: new Date(),
      ratings: [{ ratingType: 'any_ratingtype', obs: 'any_rating', stars: 3 }],
    },
    {
      ratingFor: 'other_entity',
      _id: 'other_id',
      date: new Date(),
      ratings: [
        { ratingType: 'other_ratingtype', obs: 'other_rating', stars: 3 },
      ],
    },
  ];
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
    expect(httpResponse).toEqual(ok(makeFakeRating()));
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

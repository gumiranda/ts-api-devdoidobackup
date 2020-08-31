import { HttpRequest, HttpResponse } from '../../../../bin/protocols/http';
import { LoadRatingController } from './load-rating-controller';
import {
  badRequest,
  serverError,
  noContent,
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
});

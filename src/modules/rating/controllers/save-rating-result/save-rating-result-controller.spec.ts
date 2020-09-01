import { SaveRatingResult } from '../../usecases/save-rating-result/save-rating-result';
import { HttpRequest } from '@/bin/protocols/http';
import { forbidden } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { SaveRatingResultController } from './save-result-result-controller';
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
      return new Promise((resolve) => resolve());
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
  test('should return 403 if LoadRatingById returns null', async () => {
    const { sut, loadRatingByIdStub } = makeSut();
    jest
      .spyOn(loadRatingByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('ratingId')));
  });
});

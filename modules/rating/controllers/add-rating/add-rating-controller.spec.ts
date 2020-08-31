import { HttpRequest, HttpResponse } from '../../../../bin/protocols/http';
import { Validation } from '../../../../bin/helpers/validators/validation';
import { AddRatingController } from './add-rating-controller';
import {
  badRequest,
  serverError,
  noContent,
} from '../../../../bin/helpers/http-helper';
import MockDate from 'mockdate';
import {
  AddRating,
  AddRatingModel,
} from '../../usecases/add-rating/add-rating';
interface SutTypes {
  sut: AddRatingController;
  addRatingStub: AddRating;
  validatorStub: Validation;
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error[] {
      return null;
    }
  }
  return new ValidationStub();
};
const makeAddRating = (): AddRating => {
  class AddRatingStub implements AddRating {
    async add(data: AddRatingModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddRatingStub();
};
const makeSut = (): SutTypes => {
  const validatorStub = makeValidation();
  const addRatingStub = makeAddRating();
  const sut = new AddRatingController(validatorStub, addRatingStub);
  return { sut, validatorStub, addRatingStub };
};
const makeFakeRequest = (): HttpRequest => ({
  body: {
    ratingFor: 'any_entity',
    date: new Date(),
    ratings: [{ ratingType: 'any_ratingtype', obs: 'any_rating', stars: 3 }],
  },
});
describe('AddRating Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call Validation with correct values', async () => {
    const { sut, validatorStub } = makeSut();
    const validatorSpy = jest.spyOn(validatorStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test('should return 400 if validation fails', async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce([new Error()]);
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest([new Error()]));
  });
  test('should call AddRating with correct values', async () => {
    const { sut, addRatingStub } = makeSut();
    const addRatingSpy = jest.spyOn(addRatingStub, 'add');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(addRatingSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test('should return 500 if AddRating throws', async () => {
    const { sut, addRatingStub } = makeSut();
    jest
      .spyOn(addRatingStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(noContent());
  });
});

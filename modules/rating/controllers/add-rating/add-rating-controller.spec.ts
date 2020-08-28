import { HttpRequest, HttpResponse } from '../../../../bin/protocols/http';
import { Validation } from '../../../../bin/helpers/validators/validation';
import { AddRatingController } from './add-rating-controller';
import { badRequest } from '../../../../bin/helpers/http-helper';
interface SutTypes {
  sut: AddRatingController;
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
const makeSut = (): SutTypes => {
  const validatorStub = makeValidation();
  const sut = new AddRatingController(validatorStub);
  return { sut, validatorStub };
};
const makeFakeRequest = (): HttpRequest => ({
  body: {
    ratingType: 'any_ratingtype',
    ratings: [{ obs: 'any_rating', stars: 3 }],
  },
});
describe('AddRating Controller', () => {
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
});

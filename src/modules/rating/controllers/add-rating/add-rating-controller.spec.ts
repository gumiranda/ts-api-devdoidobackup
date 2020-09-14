import { HttpRequest } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import { AddRatingController } from './add-rating-controller';
import { badRequest, serverError, noContent } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { AddRating } from '@/modules/rating/usecases/add-rating/add-rating';
import { mockValidation } from '@/bin/test/mock-validation';
import { mockAddRating } from '@/modules/rating/usecases/mocks/mock-rating';
type SutTypes = {
  sut: AddRatingController;
  addRatingStub: AddRating;
  validatorStub: Validation;
};

const makeSut = (): SutTypes => {
  const validatorStub = mockValidation();
  const addRatingStub = mockAddRating();
  const sut = new AddRatingController(validatorStub, addRatingStub);
  return { sut, validatorStub, addRatingStub };
};
const makeFakeRequest = (): HttpRequest => ({
  body: {
    ratingType: 'atendimento',
    createdAt: new Date(),
    ratings: [{ rating: 'Bom', stars: 3 }],
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

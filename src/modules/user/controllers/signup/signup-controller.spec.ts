import { SignUpController } from '@/modules/user/controllers/signup/signup-controller';
import { AddUser } from '@/modules/user/usecases/add-user/add-user';
import { HttpRequest } from '@/bin/protocols/http';
import {
  badRequest,
  serverError,
  forbidden,
  createdOk,
} from '@/bin/helpers/http-helper';
import { MissingParamError, EmailInUseError, ServerError } from '@/bin/errors';
import { Validation } from '@/bin/helpers/validators/validation';
import { mockValidation } from '@/bin/test/mock-validation';
import { mockAddUser } from '@/modules/user/usecases/mocks/mock-user';
import {
  mockFakeUser,
  mockFakeUserData,
} from '@/modules/user/models/mocks/mock-user';
import MockDate from 'mockdate';
import { addDay } from '@/bin/utils/date-fns';
const makeFakeRequest = (): HttpRequest => ({
  body: mockFakeUserData('client'),
});
type SutTypes = {
  sut: SignUpController;
  addUserStub: AddUser;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const addUserStub = mockAddUser();
  const validationStub = mockValidation();
  const sut = new SignUpController(addUserStub, validationStub);
  return {
    sut,
    validationStub,
    addUserStub,
  };
};
describe('SignUp Controller', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });
  test('Should return 500 if Validator throws', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should return 500 if AddUser throws', async () => {
    const { sut, addUserStub } = makeSut();
    jest.spyOn(addUserStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call AddUser with correct values', async () => {
    const { sut, addUserStub } = makeSut();
    const addSpy = jest.spyOn(addUserStub, 'add');
    await sut.handle(makeFakeRequest());
    const resExpected = mockFakeUser('client');
    delete resExpected._id;
    expect(addSpy).toHaveBeenCalledWith(resExpected);
  });
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(createdOk(mockFakeUser('client')));
  });
  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce([new MissingParamError('any_field')]);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest([new MissingParamError('any_field')]),
    );
  });
  test('Should return 403 if AddUser returns null', async () => {
    const { sut, addUserStub } = makeSut();
    jest
      .spyOn(addUserStub, 'add')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });
});

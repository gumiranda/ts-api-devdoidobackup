import { HttpRequest } from '@/bin/protocols/http';
import { badRequest, serverError, ok } from '@/bin/helpers/http-helper';
import { MissingParamError, EmailInUseError, ServerError } from '@/bin/errors';
import { Validation } from '@/bin/helpers/validators/validation';
import { mockValidation } from '@/bin/test/mock-validation';

import MockDate from 'mockdate';
import { UpdateUser } from '../../usecases/update-user/update-user';
import { CompleteRegisterController } from './complete-register-controller';
import { mockUpdateUser } from '../../usecases/mocks/mock-user';
import { mockFakeUserUpdated } from '../../models/mocks/mock-user';
const makeFakeRequest = (): HttpRequest => ({
  body: {
    cpf: 'any_cpf',
    phone: 'any_phone',
  },
  userId: 'any_user_id',
});
type SutTypes = {
  sut: CompleteRegisterController;
  updateUserStub: UpdateUser;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const updateUserStub = mockUpdateUser();
  const validationStub = mockValidation();
  const sut = new CompleteRegisterController(updateUserStub, validationStub);
  return {
    sut,
    validationStub,
    updateUserStub,
  };
};
describe('Complete register Controller', () => {
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

  test('Should return 500 if UpdateUser throws', async () => {
    const { sut, updateUserStub } = makeSut();
    jest
      .spyOn(updateUserStub, 'updateUser')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()));
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call UpdateUser with correct values', async () => {
    const { sut, updateUserStub } = makeSut();
    const updateUserSpy = jest.spyOn(updateUserStub, 'updateUser');

    await sut.handle(makeFakeRequest());
    expect(updateUserSpy).toHaveBeenCalledWith(
      {
        cpf: 'any_cpf',
        phone: 'any_phone',
      },
      'any_user_id',
    );
  });
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockFakeUserUpdated('client')));
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
});

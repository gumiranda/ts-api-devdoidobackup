import { HttpRequest } from '@/bin/protocols/http';
import { badRequest, serverError, ok } from '@/bin/helpers/http-helper';
import { MissingParamError, EmailInUseError, ServerError } from '@/bin/errors';
import { Validation } from '@/bin/helpers/validators/validation';
import { mockValidation } from '@/bin/test/mock-validation';

import MockDate from 'mockdate';
import { UpdateAccount } from '../../usecases/update-account/update-account';
import { CompleteRegisterController } from './complete-register-controller';
import { mockUpdateAccount } from '../../usecases/mocks/mock-account';
import { mockFakeAccountUpdated } from '../../models/mocks/mock-account';
const makeFakeRequest = (): HttpRequest => ({
  body: {
    cpf: 'any_cpf',
    phone: 'any_phone',
  },
  accountId: 'any_account_id',
});
type SutTypes = {
  sut: CompleteRegisterController;
  updateAccountStub: UpdateAccount;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const updateAccountStub = mockUpdateAccount();
  const validationStub = mockValidation();
  const sut = new CompleteRegisterController(updateAccountStub, validationStub);
  return {
    sut,
    validationStub,
    updateAccountStub,
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

  test('Should return 500 if UpdateAccount throws', async () => {
    const { sut, updateAccountStub } = makeSut();
    jest
      .spyOn(updateAccountStub, 'updateAccount')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()));
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call UpdateAccount with correct values', async () => {
    const { sut, updateAccountStub } = makeSut();
    const updateAccountSpy = jest.spyOn(updateAccountStub, 'updateAccount');

    await sut.handle(makeFakeRequest());
    expect(updateAccountSpy).toHaveBeenCalledWith(
      {
        cpf: 'any_cpf',
        phone: 'any_phone',
      },
      'any_account_id',
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
    expect(httpResponse).toEqual(ok(mockFakeAccountUpdated()));
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

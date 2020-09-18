import { HttpRequest } from '@/bin/protocols/http';
import { badRequest, serverError, ok } from '@/bin/helpers/http-helper';
import { MissingParamError, ServerError } from '@/bin/errors';
import { Validation } from '@/bin/helpers/validators/validation';
import { mockValidation } from '@/bin/test/mock-validation';

import MockDate from 'mockdate';
import { mockFakeUserPasswordUpdated } from '../../models/mocks/mock-user';
import { UpdatePasswordController } from './update-password-controller';
import { UpdatePassword } from '../../usecases/update-password/update-password';
import { mockUpdatePassword } from '../../usecases/mocks/mock-user';
const makeFakeRequest = (): HttpRequest => ({
  body: {
    newPassword: 'new_password',
    oldPassword: 'old_password',
  },
  userId: 'any_user_id',
});
type SutTypes = {
  sut: UpdatePasswordController;
  updatePasswordStub: UpdatePassword;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const updatePasswordStub = mockUpdatePassword();
  const validationStub = mockValidation();
  const sut = new UpdatePasswordController(updatePasswordStub, validationStub);
  return {
    sut,
    validationStub,
    updatePasswordStub,
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

  test('Should return 500 if UpdatePassword throws', async () => {
    const { sut, updatePasswordStub } = makeSut();
    jest
      .spyOn(updatePasswordStub, 'updatePassword')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()));
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call UpdatePassword with correct values', async () => {
    const { sut, updatePasswordStub } = makeSut();
    const updatePasswordSpy = jest.spyOn(updatePasswordStub, 'updatePassword');

    await sut.handle(makeFakeRequest());
    expect(updatePasswordSpy).toHaveBeenCalledWith(
      'new_password',
      'old_password',
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
    let passwordUpdated = mockFakeUserPasswordUpdated('client');
    expect(httpResponse).toEqual(ok(passwordUpdated));
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

import { HttpRequest } from '@/bin/protocols/http';
import { serverError, ok, unauthorized } from '@/bin/helpers/http-helper';
import { LoginController } from '@/modules/user/controllers/login/login-controller';
import { Validation } from '@/bin/helpers/validators/validation';
import { mockAuthentication } from '@/bin/test/mock-auth';
import { mockValidation } from '@/bin/test/mock-validation';
import { Authentication } from '@/modules/user/usecases/auth/authentication';

type SutTypes = {
  sut: LoginController;
  validatorStub: Validation;
  authenticationStub: Authentication;
};

const makeSut = (): SutTypes => {
  const validatorStub = mockValidation();
  const authenticationStub = mockAuthentication();
  const sut = new LoginController(validatorStub, authenticationStub);
  return { sut, validatorStub, authenticationStub };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    password: 'any_password',
    passwordConfirmation: 'any_password',
    email: 'email@email.com',
  },
});
describe('Login Controller', () => {
  test('Should returns 500 ValidatorContract throws', async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('Should returns 500 Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('Should returns 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(unauthorized());
  });
  test('Should returns 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    await sut.handle(makeFakeRequest());
    expect(authSpy).toHaveBeenCalledWith('email@email.com', 'any_password');
  });
});

import { HttpRequest } from '@/bin/protocols/http';
import { serverError, ok, unauthorized } from '@/bin/helpers/http-helper';
import { LoginController } from './login-controller';
import { Authentication } from '../../usecases/auth/authentication';
import { Validation } from '@/bin/helpers/validators/validation';

interface SutTypes {
  sut: LoginController;
  validatorStub: Validation;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(validatorStub, authenticationStub);
  return { sut, validatorStub, authenticationStub };
};
const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new AuthenticationStub();
};
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error[] {
      return null;
    }
  }
  return new ValidationStub();
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

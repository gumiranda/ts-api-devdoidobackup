import { HttpRequest } from '@/bin/protocols/http';
import { serverError, ok, unauthorized } from '@/bin/helpers/http-helper';
import { Validation } from '@/bin/helpers/validators/validation';
import { mockValidation } from '@/bin/test/mock-validation';
import { LoginFacebookController } from './login-facebook-controller';
import { mockAuthenticationFacebook } from '@/bin/test/mock-auth';
import { AuthenticationFacebook } from '../../usecases/auth-fb/authentication-facebook';

type SutTypes = {
  sut: LoginFacebookController;
  validatorStub: Validation;
  AuthenticationFacebookStub: AuthenticationFacebook;
};

const makeSut = (): SutTypes => {
  const validatorStub = mockValidation();
  const AuthenticationFacebookStub = mockAuthenticationFacebook();
  const sut = new LoginFacebookController(
    validatorStub,
    AuthenticationFacebookStub,
  );
  return { sut, validatorStub, AuthenticationFacebookStub };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    faceId: 'any_id',
    faceToken: 'any_token',
  },
});
describe('Login Facebook Controller', () => {
  test('Should returns 500 ValidatorContract throws', async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('Should returns 500 AuthenticationFacebook throws', async () => {
    const { sut, AuthenticationFacebookStub } = makeSut();
    jest
      .spyOn(AuthenticationFacebookStub, 'authFacebook')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('Should returns 401 if invalid credentials are provided', async () => {
    const { sut, AuthenticationFacebookStub } = makeSut();
    jest
      .spyOn(AuthenticationFacebookStub, 'authFacebook')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(unauthorized());
  });
  test('Should returns 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });
  test('Should call AuthenticationFacebook with correct values', async () => {
    const { sut, AuthenticationFacebookStub } = makeSut();
    const authSpy = jest.spyOn(AuthenticationFacebookStub, 'authFacebook');
    await sut.handle(makeFakeRequest());
    expect(authSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });
});

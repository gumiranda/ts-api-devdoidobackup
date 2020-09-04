import { forbidden, ok, serverError } from '../../helpers/http-helper';
import { AccessDeniedError } from '../../errors';
import { AuthMiddleware } from './auth-middleware';
import { LoadAccountByToken } from '../protocols/usecases/load-account-by-token';
import { makeFakeRequestHeader } from '@/bin/test/mock-auth';
import { makeLoadAccountByToken } from '@/modules/account/usecases/mocks/mock-account';

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
};

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return {
    sut,
    loadAccountByTokenStub,
  };
};
describe('auth middleware', () => {
  test('should return 403 if no authorization exists in headers', async () => {
    const role = 'any_role';
    const { sut } = makeSut(role);
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
  test('should call load with bearer token', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    await sut.handle(makeFakeRequestHeader());
    expect(loadSpy).toHaveBeenCalledWith('any_token', role);
  });
  test('should return 403 if LoadAccountByToken returns null', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequestHeader());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
  test('should return 200 if LoadAccountByToken returns an account', async () => {
    const role = 'any_role';
    const { sut } = makeSut(role);
    const httpResponse = await sut.handle(makeFakeRequestHeader());
    expect(httpResponse).toEqual(ok({ _id: 'valid_id' }));
  });
  test('should return 500 if LoadAccountByToken throws', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = await sut.handle(makeFakeRequestHeader());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});

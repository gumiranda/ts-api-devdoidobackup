import { forbidden, ok, serverError } from '@/bin/helpers/http-helper';
import { AccessDeniedError } from '@/bin/errors';
import { AuthMiddleware } from '@/bin/middlewares/auth/auth-middleware';
import { mockFakeRequestHeader } from '@/bin/test/mock-auth';
import { mockLoadUserByToken } from '@/modules/user/usecases/mocks/mock-user';
import { LoadUserByToken } from '@/modules/user/usecases/load-user-by-token/load-user-by-token';

type SutTypes = {
  sut: AuthMiddleware;
  loadUserByTokenStub: LoadUserByToken;
};

const makeSut = (role?: string): SutTypes => {
  const loadUserByTokenStub = mockLoadUserByToken();
  const sut = new AuthMiddleware(loadUserByTokenStub, role);
  return {
    sut,
    loadUserByTokenStub,
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
    const { sut, loadUserByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadUserByTokenStub, 'load');
    await sut.handle(mockFakeRequestHeader());
    expect(loadSpy).toHaveBeenCalledWith('any_token', role);
  });
  test('should return 403 if LoadUserByToken returns null', async () => {
    const role = 'any_role';
    const { sut, loadUserByTokenStub } = makeSut(role);
    jest
      .spyOn(loadUserByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(mockFakeRequestHeader());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
  test('should return 200 if LoadUserByToken returns an user', async () => {
    const role = 'any_role';
    const { sut } = makeSut(role);
    const httpResponse = await sut.handle(mockFakeRequestHeader());
    expect(httpResponse).toEqual(ok({ userId: 'valid_id' }));
  });
  test('should return 500 if LoadUserByToken throws', async () => {
    const role = 'any_role';
    const { sut, loadUserByTokenStub } = makeSut(role);
    jest
      .spyOn(loadUserByTokenStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = await sut.handle(mockFakeRequestHeader());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});

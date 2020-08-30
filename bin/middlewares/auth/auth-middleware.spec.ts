import { forbidden } from '../../helpers/http-helper';
import { AccessDeniedError } from '../../errors';
import { AuthMiddleware } from './auth-middleware';
import { LoadAccountByToken } from '../protocols/usecases/load-account-by-token';
import { AccountModel } from '../../../modules/account/models/account-model';
const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenStub();
};
interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}
const makeFakeAccount = (): AccountModel => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});
const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return {
    sut,
    loadAccountByTokenStub,
  };
};
describe('auth middleware', () => {
  test('should return 403 if no Authorization exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
  test('should call load with bearer token', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    await sut.handle({
      headers: { Authorization: 'Bearer any_token' },
    });
    expect(loadSpy).toHaveBeenCalledWith('any_token');
  });
});

import { AccountModel } from '../../../../../modules/account/models/account-model';
import { HttpRequest } from '../../../../protocols/http';
import { DbLoadAccountByToken } from './db-load-account-by-token';
import { TokenDecrypter } from '../../../../protocols/crypto/token-decrypter';
const makeTokenDecrypter = (): TokenDecrypter => {
  class TokenDecrypterStub implements TokenDecrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('any_value'));
    }
  }
  return new TokenDecrypterStub();
};
interface SutTypes {
  sut: DbLoadAccountByToken;
  tokenDecrypterStub: TokenDecrypter;
}
const makeFakeAccount = (): AccountModel => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});
const makeFakeRequest = (): HttpRequest => ({
  headers: { Authorization: 'Bearer any_token' },
});
const makeSut = (role?: string): SutTypes => {
  const tokenDecrypterStub = makeTokenDecrypter();
  const sut = new DbLoadAccountByToken(tokenDecrypterStub);
  return {
    sut,
    tokenDecrypterStub,
  };
};
describe('DbLoadAccountByToken tests', () => {
  test('should call TokenDecrypter with correct values', async () => {
    const { sut, tokenDecrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(tokenDecrypterStub, 'decrypt');
    await sut.load('any_token');
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });
});

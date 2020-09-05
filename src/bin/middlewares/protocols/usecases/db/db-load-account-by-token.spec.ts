import { DbLoadAccountByToken } from './db-load-account-by-token';
import { TokenDecrypter } from '../../../../protocols/crypto/token-decrypter';
import { LoadAccountByTokenRepository } from '@/modules/account/repositories/protocols/load-account-by-token-repository';
import { mockTokenDecrypter } from '@/bin/test/mock-crypto';
import { mockLoadAccountByTokenRepository } from '@/modules/account/repositories/mocks/mock-account-repository';
import { mockFakeAccount } from '@/modules/account/models/mocks/mock-account';
import faker from 'faker';
type SutTypes = {
  sut: DbLoadAccountByToken;
  tokenDecrypterStub: TokenDecrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};
let token: string;
let role: string;
const makeSut = (role?: string): SutTypes => {
  const tokenDecrypterStub = mockTokenDecrypter();
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(
    tokenDecrypterStub,
    loadAccountByTokenRepositoryStub,
  );
  return {
    sut,
    tokenDecrypterStub,
    loadAccountByTokenRepositoryStub,
  };
};
describe('DbLoadAccountByToken tests', () => {
  beforeEach(() => {
    token = faker.random.uuid();
    role = faker.random.word();
  });
  test('should call TokenDecrypter with correct values', async () => {
    const { sut, tokenDecrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(tokenDecrypterStub, 'decrypt');
    await sut.load(token, role);
    expect(decryptSpy).toHaveBeenCalledWith(token);
  });
  test('should return null if TokenDecrypter returns null', async () => {
    const { sut, tokenDecrypterStub } = makeSut();
    tokenDecrypterStub.plaintext = null;
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });
  test('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    await sut.load(token, role);
    expect(loadAccountByTokenRepositoryStub.token).toBe(token);
    expect(loadAccountByTokenRepositoryStub.role).toBe(role);
  });
  test('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    loadAccountByTokenRepositoryStub.accountModel = null;
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });
  test('should return account if LoadAccountByTokenRepository returns an account', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const account = await sut.load(token, role);
    expect(account).toEqual(loadAccountByTokenRepositoryStub.accountModel);
  });
  test('Should throw if TokenDecrypter throws', async () => {
    const { sut, tokenDecrypterStub } = makeSut();
    jest
      .spyOn(tokenDecrypterStub, 'decrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.load(token, role);
    await expect(promise).rejects.toThrow();
  });
  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.load(token, role);
    await expect(promise).rejects.toThrow();
  });
});

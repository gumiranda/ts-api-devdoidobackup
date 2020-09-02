import { DbLoadAccountByToken } from './db-load-account-by-token';
import { TokenDecrypter } from '../../../../protocols/crypto/token-decrypter';
import { LoadAccountByTokenRepository } from '@/modules/account/repositories/protocols/load-account-by-token-repository';
import {
  makeLoadAccountByTokenRepository,
  makeFakeAccount,
} from '@/bin/test/mock-account';
import { makeTokenDecrypter } from '@/bin/test/mock-crypto';

type SutTypes = {
  sut: DbLoadAccountByToken;
  tokenDecrypterStub: TokenDecrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const makeSut = (role?: string): SutTypes => {
  const tokenDecrypterStub = makeTokenDecrypter();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
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
  test('should call TokenDecrypter with correct values', async () => {
    const { sut, tokenDecrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(tokenDecrypterStub, 'decrypt');
    await sut.load('any_token', 'any_role');
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });
  test('should return null if TokenDecrypter returns null', async () => {
    const { sut, tokenDecrypterStub } = makeSut();
    jest
      .spyOn(tokenDecrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });
  test('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken',
    );
    await sut.load('any_token', 'any_role');
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });
  test('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });
  test('should return account if LoadAccountByTokenRepository returns an account', async () => {
    const { sut } = makeSut();
    const account = await sut.load('any_token', 'any_role');
    expect(account).toEqual(makeFakeAccount());
  });
  test('Should throw if TokenDecrypter throws', async () => {
    const { sut, tokenDecrypterStub } = makeSut();
    jest
      .spyOn(tokenDecrypterStub, 'decrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.load('any_token', 'any_role');
    await expect(promise).rejects.toThrow();
  });
  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.load('any_token', 'any_role');
    await expect(promise).rejects.toThrow();
  });
});

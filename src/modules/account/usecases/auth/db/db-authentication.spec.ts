import { DbAuthentication } from './db-authentication';
import { HashComparer } from '@/bin/protocols/crypto/hash-comparer';
import { TokenGenerator } from '@/bin/protocols/crypto/token-generator';
import { LoadAccountByEmailRepository } from '../../../repositories/protocols/load-account-by-email-repository';
import { mockHashComparer, mockTokenGenerator } from '@/bin/test/mock-crypto';
import { mockLoadAccountByEmailRepositoryNotNull } from '@/modules/account/repositories/mocks/mock-account-repository';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepositoryNotNull();
  const hashComparerStub = mockHashComparer();
  const tokenGeneratorStub = mockTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  );
  return {
    sut,
    tokenGeneratorStub,
    hashComparerStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.auth('any_email@any.com', 'valid_password');
    expect(loadSpy).toHaveBeenCalledWith('any_email@any.com');
  });
  test('Should throw if LoadAccountEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.auth('any_email@any.com', 'valid_password');
    await expect(promise).rejects.toThrow();
  });
  test('Should return null if LoadAccountEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null);
    const accessToken = await sut.auth('any_email@any.com', 'valid_password');
    expect(accessToken).toBeNull();
  });
  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.auth('any_email@any.com', 'valid_password');
    expect(compareSpy).toHaveBeenCalledWith('valid_password', 'any_password');
  });
  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.auth('any_email@any.com', 'valid_password');
    await expect(promise).rejects.toThrow();
  });
  test('Should return null if HashComparer returns null', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const accessToken = await sut.auth('any_email@any.com', 'valid_password');
    expect(accessToken).toBeNull();
  });
  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
    await sut.auth('any_email@any.com', 'valid_password');
    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });
  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.auth('any_email@any.com', 'valid_password');
    await expect(promise).rejects.toThrow();
  });
  test('Should call TokenGenerator with success ', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth('any_email@any.com', 'valid_password');
    expect(accessToken).toBe('any_token');
  });
});

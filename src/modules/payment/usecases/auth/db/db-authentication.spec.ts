import { DbAuthentication } from '@/modules/user/usecases/auth/db/db-authentication';
import { HashComparer } from '@/bin/protocols/cryptography/hash-comparer';
import { TokenGenerator } from '@/bin/protocols/cryptography/token-generator';
import { LoadUserByEmailRepository } from '@/modules/user/repositories/protocols/load-user-by-email-repository';
import { mockHashComparer, mockTokenGenerator } from '@/bin/test/mock-crypto';
import { mockLoadUserByEmailRepositoryNotNull } from '@/modules/user/repositories/mocks/mock-user-repository';

type SutTypes = {
  sut: DbAuthentication;
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
};

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = mockLoadUserByEmailRepositoryNotNull();
  const hashComparerStub = mockHashComparer();
  const tokenGeneratorStub = mockTokenGenerator();
  const sut = new DbAuthentication(
    loadUserByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  );
  return {
    sut,
    tokenGeneratorStub,
    hashComparerStub,
    loadUserByEmailRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadUserEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail');
    await sut.auth('any_email@any.com', 'valid_password');
    expect(loadSpy).toHaveBeenCalledWith('any_email@any.com');
  });
  test('Should throw if LoadUserEmailRepository throws', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.auth('any_email@any.com', 'valid_password');
    await expect(promise).rejects.toThrow();
  });
  test('Should return null if LoadUserEmailRepository returns null', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByEmailRepositoryStub, 'loadByEmail')
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
    const { sut, tokenGeneratorStub } = makeSut();
    const accessToken = await sut.auth('any_email@any.com', 'valid_password');
    expect(accessToken).toBe(tokenGeneratorStub.ciphertext);
  });
});

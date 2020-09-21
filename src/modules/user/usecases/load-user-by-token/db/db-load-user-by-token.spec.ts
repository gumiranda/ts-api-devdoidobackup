import { DbLoadUserByToken } from './db-load-user-by-token';
import { TokenDecrypter } from '@/bin/protocols/cryptography/token-decrypter';
import { LoadUserByTokenRepository } from '@/modules/user/repositories/protocols/load-user-by-token-repository';
import { mockTokenDecrypter } from '@/bin/test/mock-crypto';
import { mockLoadUserByTokenRepository } from '@/modules/user/repositories/mocks/mock-user-repository';
import faker from 'faker-br';
type SutTypes = {
  sut: DbLoadUserByToken;
  tokenDecrypterStub: TokenDecrypter;
  loadUserByTokenRepositoryStub: LoadUserByTokenRepository;
};
let token: string;
let role: string;
const makeSut = (role?: string): SutTypes => {
  const tokenDecrypterStub = mockTokenDecrypter();
  const loadUserByTokenRepositoryStub = mockLoadUserByTokenRepository();
  const sut = new DbLoadUserByToken(
    tokenDecrypterStub,
    loadUserByTokenRepositoryStub,
  );
  return {
    sut,
    tokenDecrypterStub,
    loadUserByTokenRepositoryStub,
  };
};
describe('DbLoadUserByToken tests', () => {
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
    const user = await sut.load(token, role);
    expect(user).toBeNull();
  });
  test('should call LoadUserByTokenRepository with correct values', async () => {
    const { sut, loadUserByTokenRepositoryStub } = makeSut();
    await sut.load(token, role);
    expect(loadUserByTokenRepositoryStub.token).toBe(token);
    expect(loadUserByTokenRepositoryStub.role).toBe(role);
  });
  test('should return null if LoadUserByTokenRepository returns null', async () => {
    const { sut, loadUserByTokenRepositoryStub } = makeSut();
    loadUserByTokenRepositoryStub.userModel = null;
    const user = await sut.load(token, role);
    expect(user).toBeNull();
  });
  test('should return user if LoadUserByTokenRepository returns an user', async () => {
    const { sut, loadUserByTokenRepositoryStub } = makeSut();
    const user = await sut.load(token, role);
    expect(user).toEqual(loadUserByTokenRepositoryStub.userModel);
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
  test('Should throw if LoadUserByTokenRepository throws', async () => {
    const { sut, loadUserByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.load(token, role);
    await expect(promise).rejects.toThrow();
  });
});

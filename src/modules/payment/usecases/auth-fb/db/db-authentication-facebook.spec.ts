import { TokenGenerator } from '@/bin/protocols/cryptography/token-generator';
import { mockTokenGenerator } from '@/bin/test/mock-crypto';
import { mockLoadUserByFaceTokenRepository } from '@/modules/user/repositories/mocks/mock-user-repository';
import { LoadUserByFaceTokenRepository } from '@/modules/user/repositories/protocols/load-user-by-face-token-repository';
import { DbAuthenticationFacebook } from './db-authentication-facebook';

type SutTypes = {
  sut: DbAuthenticationFacebook;
  loadUserByFaceTokenRepositoryStub: LoadUserByFaceTokenRepository;
  tokenGeneratorStub: TokenGenerator;
};

const makeSut = (): SutTypes => {
  const loadUserByFaceTokenRepositoryStub = mockLoadUserByFaceTokenRepository();
  const tokenGeneratorStub = mockTokenGenerator();
  const sut = new DbAuthenticationFacebook(
    loadUserByFaceTokenRepositoryStub,
    tokenGeneratorStub,
  );
  return {
    sut,
    tokenGeneratorStub,
    loadUserByFaceTokenRepositoryStub,
  };
};

describe('DbAuthenticationFacebook UseCase', () => {
  test('Should call LoadUserByFaceTokenRepository with correct token', async () => {
    const { sut, loadUserByFaceTokenRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(
      loadUserByFaceTokenRepositoryStub,
      'loadByFaceToken',
    );
    await sut.authFacebook('any_id', 'any_token');
    expect(loadSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });
  test('Should throw if LoadUserByFaceTokenRepository throws', async () => {
    const { sut, loadUserByFaceTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByFaceTokenRepositoryStub, 'loadByFaceToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.authFacebook('any_id', 'any_token');
    await expect(promise).rejects.toThrow();
  });
  test('Should return null if LoadUserByFaceTokenRepository returns null', async () => {
    const { sut, loadUserByFaceTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByFaceTokenRepositoryStub, 'loadByFaceToken')
      .mockReturnValueOnce(null);
    const accessToken = await sut.authFacebook('any_id', 'any_token');
    expect(accessToken).toBeNull();
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
    await sut.authFacebook('any_id', 'any_token');
    expect(generateSpy).toHaveBeenCalledWith('valid_id');
  });
  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.authFacebook('any_id', 'any_token');
    await expect(promise).rejects.toThrow();
  });
  test('Should call TokenGenerator with success ', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const accessToken = await sut.authFacebook('any_id', 'any_token');
    expect(accessToken).toBe(tokenGeneratorStub.ciphertext);
  });
});

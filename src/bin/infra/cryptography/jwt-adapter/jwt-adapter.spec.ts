import jwt from 'jsonwebtoken';
import { JwtAdapter } from '@/bin/infra/cryptography/jwt-adapter/jwt-adapter';
jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_token'));
  },
  async verify(): Promise<string> {
    return new Promise((resolve) => resolve('any_value'));
  },
}));
const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret');
};
describe('jwt geral', () => {
  describe('sign()', () => {
    test('should call sign with correct values', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.generate('any_id');
      expect(signSpy).toHaveBeenCalledWith({ _id: 'any_id' }, 'secret');
    });
    test('should return a token on sign success', async () => {
      const sut = makeSut();
      const accessToken = await sut.generate('any_id');
      expect(accessToken).toBe('any_token');
    });
    test('should throw if sign throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.generate('any_id');
      await expect(promise).rejects.toThrow();
    });
  });
  describe('verify()', () => {
    test('should call verify with correct values', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt('any_token');
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });
    test('should return a value on verify success', async () => {
      const sut = makeSut();
      const value = await sut.decrypt('any_token');
      expect(value).toBe('any_value');
    });
    test('should throw if verify throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.decrypt('any_token');
      await expect(promise).rejects.toThrow();
    });
  });
});

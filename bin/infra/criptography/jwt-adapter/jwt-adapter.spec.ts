import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';
import { sign } from 'crypto';
jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_token'));
  },
}));
const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret');
};
describe('Name of the group', () => {
  test('should call sign with correct values', async () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.generate('any_id');
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });
  test('should return a token on sign success', async () => {
    const sut = makeSut();
    const accessToken = await sut.generate('any_id');
    expect(accessToken).toBe('any_token');
  });
  test('should throw if sign throws', async () => {
    const sut = new JwtAdapter('secret');
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.generate('any_id');
    await expect(promise).rejects.toThrow();
  });
});

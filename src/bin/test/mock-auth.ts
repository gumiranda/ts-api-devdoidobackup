import { HttpRequest } from '../protocols/http';
import { Authentication } from '@/modules/account/usecases/auth/authentication';

export const makeFakeRequestHeader = (): HttpRequest => ({
  headers: { authorization: 'Bearer any_token' },
});
export const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new AuthenticationStub();
};

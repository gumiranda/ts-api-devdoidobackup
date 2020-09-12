import { HttpRequest } from '@/bin/protocols/http';
import { Authentication } from '@/modules/user/usecases/auth/authentication';

export const mockFakeRequestHeader = (): HttpRequest => ({
  headers: { authorization: 'Bearer any_token' },
});
export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new AuthenticationStub();
};

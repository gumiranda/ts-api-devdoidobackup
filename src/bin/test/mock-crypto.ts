import { TokenDecrypter } from '../protocols/crypto/token-decrypter';
import { Encrypter } from '../protocols/crypto/encrypter';
import { HashComparer } from '../protocols/crypto/hash-comparer';
import { TokenGenerator } from '../protocols/crypto/token-generator';

export const mockTokenDecrypter = (): TokenDecrypter => {
  class TokenDecrypterStub implements TokenDecrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('any_value'));
    }
  }
  return new TokenDecrypterStub();
};
export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};
export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(password: string, hashedPassword: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashComparerStub();
};
export const mockTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new TokenGeneratorStub();
};

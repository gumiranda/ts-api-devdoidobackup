import { TokenDecrypter } from '@/bin/protocols/crypto/token-decrypter';
import { Encrypter } from '@/bin/protocols/crypto/encrypter';
import { HashComparer } from '@/bin/protocols/crypto/hash-comparer';
import { TokenGenerator } from '@/bin/protocols/crypto/token-generator';
import faker from 'faker';
export const mockTokenDecrypter = (): TokenDecrypter => {
  class TokenDecrypterStub implements TokenDecrypter {
    plaintext = faker.internet.password();
    ciphertext: string;
    async decrypt(value: string): Promise<string> {
      this.ciphertext = value;
      return new Promise((resolve) => resolve(this.plaintext));
    }
  }
  return new TokenDecrypterStub();
};
export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    hashedPassword = faker.random.uuid();
    plaintext: string;
    async encrypt(plaintext: string): Promise<string> {
      this.plaintext = plaintext;
      return new Promise((resolve) => resolve(this.hashedPassword));
    }
  }
  return new EncrypterStub();
};
export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    password: string;
    hashedPassword: string;
    isValid = true;
    async compare(password: string, hashedPassword: string): Promise<boolean> {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return new Promise((resolve) => resolve(this.isValid));
    }
  }
  return new HashComparerStub();
};
export const mockTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    ciphertext = faker.random.uuid();
    id: string;
    async generate(id: string): Promise<string> {
      this.id = id;
      return new Promise((resolve) => resolve(this.ciphertext));
    }
  }
  return new TokenGeneratorStub();
};

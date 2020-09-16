import { TokenDecrypter } from '@/bin/protocols/cryptography/token-decrypter';
import { Encrypter } from '@/bin/protocols/cryptography/encrypter';
import { HashComparer } from '@/bin/protocols/cryptography/hash-comparer';
import { TokenGenerator } from '@/bin/protocols/cryptography/token-generator';
import faker from 'faker-br';
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
    hashedText = faker.random.uuid();
    plaintext: string;
    async encrypt(plaintext: string): Promise<string> {
      this.plaintext = plaintext;
      return new Promise((resolve) => resolve(this.hashedText));
    }
  }
  return new EncrypterStub();
};
export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    password: string;
    hashedText: string;
    isValid = true;
    async compare(password: string, hashedText: string): Promise<boolean> {
      this.password = password;
      this.hashedText = hashedText;
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

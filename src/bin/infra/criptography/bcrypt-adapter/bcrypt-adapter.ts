import bcrypt from 'bcrypt';
import { Encrypter } from '@/bin/protocols/crypto/encrypter';
import { HashComparer } from '@/bin/protocols/crypto/hash-comparer';

export class BcryptAdapter implements Encrypter, HashComparer {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }
  plaintext: string;
  hashedText: string;
  async compare(password: string, hashedText: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hashedText);
    return isValid;
  }
  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}

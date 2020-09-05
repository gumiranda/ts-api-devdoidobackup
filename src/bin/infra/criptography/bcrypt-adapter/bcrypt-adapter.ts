import bcrypt from 'bcrypt';
import { Encrypter } from '../../../protocols/crypto/encrypter';
import { HashComparer } from '../../../protocols/crypto/hash-comparer';

export class BcryptAdapter implements Encrypter, HashComparer {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }
  plaintext: string;
  hashedPassword: string;
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  }
  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}

import { TokenGenerator } from '../../../protocols/crypto/token-generator';
import jwt from 'jsonwebtoken';
import { TokenDecrypter } from '../../../protocols/crypto/token-decrypter';
export class JwtAdapter implements TokenGenerator, TokenDecrypter {
  private readonly secret: string;
  constructor(secret: string) {
    this.secret = secret;
  }
  async decrypt(token: string): Promise<string> {
    const value: any = await jwt.verify(token, this.secret);
    return value;
  }
  async generate(_id: string): Promise<string> {
    const accessToken = await jwt.sign({ _id }, this.secret);
    return accessToken;
  }
}

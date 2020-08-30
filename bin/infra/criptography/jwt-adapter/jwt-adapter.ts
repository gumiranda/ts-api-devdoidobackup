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
  async generate(id: string): Promise<string> {
    const accessToken = await jwt.sign(
      { id },
      this.secret ? this.secret : 'f2dce72ee92ef131cb829fa37d0eb9e8',
    );
    return accessToken;
  }
}

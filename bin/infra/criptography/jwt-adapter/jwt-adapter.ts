import { TokenGenerator } from '../../../protocols/crypto/token-generator';
import jwt from 'jsonwebtoken';
export class JwtAdapter implements TokenGenerator {
  private readonly secret: string;
  constructor(secret: string) {
    this.secret = secret;
  }
  async generate(id: string): Promise<string> {
    const accessToken = await jwt.sign(
      { id },
      this.secret ? this.secret : 'f2dce72ee92ef131cb829fa37d0eb9e8',
    );
    return accessToken;
  }
}

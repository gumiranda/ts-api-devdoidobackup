import { TokenGenerator } from '@/bin/protocols/cryptography/token-generator';
import { LoadUserByFaceTokenRepository } from '@/modules/user/repositories/protocols/load-user-by-face-token-repository';
import { AuthenticationFacebook } from '@/modules/user/usecases/auth-fb/authentication-facebook';

export class DbAuthenticationFacebook implements AuthenticationFacebook {
  private readonly loadUserByFaceTokenRepository: LoadUserByFaceTokenRepository;
  private readonly tokenGenerator: TokenGenerator;
  constructor(
    loadUserByFaceTokenRepository: LoadUserByFaceTokenRepository,
    tokenGenerator: TokenGenerator,
  ) {
    this.loadUserByFaceTokenRepository = loadUserByFaceTokenRepository;
    this.tokenGenerator = tokenGenerator;
  }
  async authFacebook(faceId: string, faceToken: string): Promise<string> {
    const user = await this.loadUserByFaceTokenRepository.loadByFaceToken(
      faceId,
      faceToken,
    );
    if (user) {
      const accessToken = await this.tokenGenerator.generate(user._id);
      return accessToken;
    }
    return null;
  }
}

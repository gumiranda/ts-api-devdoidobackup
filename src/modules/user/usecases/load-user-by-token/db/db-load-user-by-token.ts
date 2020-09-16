import { LoadUserByToken } from '@/modules/user/usecases/load-user-by-token/load-user-by-token';
import { UserModel } from '@/modules/user/models/user-model';
import { TokenDecrypter } from '@/bin/protocols/cryptography/token-decrypter';
import { LoadUserByTokenRepository } from '@/modules/user/repositories/protocols/load-user-by-token-repository';

export class DbLoadUserByToken implements LoadUserByToken {
  constructor(
    private readonly decrypter: TokenDecrypter,
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository,
  ) {}
  async load(accessToken: string, role?: string): Promise<UserModel> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) {
      const user = await this.loadUserByTokenRepository.loadByToken(
        accessToken,
        role,
      );
      if (user) {
        return user;
      }
    }
    return null;
  }
}

import { LoadAccountByToken } from '../load-account-by-token';
import { AccountModel } from '@/modules/account/models/account-model';
import { TokenDecrypter } from '../../../../protocols/crypto/token-decrypter';
import { LoadAccountByTokenRepository } from '@/modules/account/repositories/protocols/load-account-by-token-repository';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: TokenDecrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}
  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role,
      );
      if (account) {
        return account;
      }
    }
    return null;
  }
}

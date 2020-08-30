import { LoadAccountByToken } from '../load-account-by-token';
import { AccountModel } from '../../../../../modules/account/models/account-model';
import { TokenDecrypter } from '../../../../protocols/crypto/token-decrypter';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: TokenDecrypter) {}
  async load(accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken);
    return null;
  }
}

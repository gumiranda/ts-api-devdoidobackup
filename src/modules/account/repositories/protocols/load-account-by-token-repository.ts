import { AccountModel } from '../../models/account-model';

export interface LoadAccountByTokenRepository {
  accountModel: AccountModel;
  role: string;
  token: string;
  loadByToken(token: string, role?: string): Promise<AccountModel>;
}

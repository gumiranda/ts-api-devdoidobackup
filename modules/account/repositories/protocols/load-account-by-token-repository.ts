import { AccountModel } from '../../models/account-model';

export interface LoadAccountByTokenRepository {
  loadByToken(token: string, role?: string): Promise<AccountModel>;
}

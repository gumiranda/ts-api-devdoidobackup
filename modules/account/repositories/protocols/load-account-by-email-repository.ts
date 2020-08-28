import { AccountModel } from '../../models/account-model';

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel>;
}

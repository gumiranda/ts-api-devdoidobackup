import { AccountModel } from '@/modules/account/models/account-model';

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel>;
}

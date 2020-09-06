import { AccountModel } from '@/modules/account/models/account-model';

export interface LoadAccountByPageRepository {
  loadByPage(
    page: number,
    accountId: string,
  ): Promise<Omit<AccountModel, 'password'>[]>;
  countAccountsByPage(page: number, accountId: string): Promise<number>;
}

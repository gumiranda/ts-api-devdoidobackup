import { AccountModel } from '../../models/account-model';

export interface LoadAccountByPageRepository {
  loadByPage(page: number, accountId: string): Promise<AccountModel[]>;
  countAccountsByPage(page: number, accountId: string): Promise<number>;
}

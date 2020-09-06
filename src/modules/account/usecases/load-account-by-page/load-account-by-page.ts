import { AccountsPaginate } from '@/modules/account/models/account-model';

export interface LoadAccountByPage {
  loadByPage(page: number, accountId: string): Promise<AccountsPaginate>;
}

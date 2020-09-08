import { AccountModel } from '@/modules/account/models/account-model';

export interface LoadAccountById {
  loadById(_id: string): Promise<AccountModel>;
}

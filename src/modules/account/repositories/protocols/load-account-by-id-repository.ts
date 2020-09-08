import { AccountModel } from '@/modules/account/models/account-model';

export interface LoadAccountByIdRepository {
  accountModel: AccountModel;
  _id: string;
  loadById(_id: string): Promise<AccountModel>;
}

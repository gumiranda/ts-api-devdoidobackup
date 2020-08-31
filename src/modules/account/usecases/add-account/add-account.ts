import { AccountModel } from '../../models/account-model';

export type AddAccountModel = Omit<AccountModel, '_id'>;

export type AddAccount = {
  add(account: AddAccountModel): Promise<AccountModel>;
};

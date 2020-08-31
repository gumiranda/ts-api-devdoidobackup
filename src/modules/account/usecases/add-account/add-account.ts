import { AccountModel } from '../../models/account-model';

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AddAccount {
  add(account: AddAccountModel): Promise<AccountModel>;
}

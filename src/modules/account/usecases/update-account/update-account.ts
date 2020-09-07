import { UserData, AccountModel } from '@/modules/account/models/account-model';

export type UpdateAccount = {
  updateAccount(
    data: UserData,
    accountId: string,
  ): Promise<Omit<AccountModel, 'password'>>;
};

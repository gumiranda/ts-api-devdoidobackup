import { UserData, AccountModel } from '../../models/account-model';

export interface UpdateAccountRepository {
  updateOne(
    userData: UserData,
    accountId: string,
  ): Promise<Omit<AccountModel, 'password'>>;
}

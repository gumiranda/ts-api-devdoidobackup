import { AccountModel } from '../../models/account-model';

export interface UpdatePassword {
  updatePassword(
    newPassword: string,
    oldPassword: string,
    accountId: string,
  ): Promise<Omit<AccountModel, 'password'>>;
}

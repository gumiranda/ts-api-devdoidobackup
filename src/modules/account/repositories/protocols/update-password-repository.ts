import { AccountModel } from '../../models/account-model';

export interface UpdatePasswordRepository {
  updatePassword(
    newPassword: string,
    accountId: string,
  ): Promise<Omit<AccountModel, 'password'>>;
}

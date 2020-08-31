import { AddAccountModel } from '../../usecases/add-account/add-account';
import { AccountModel } from '../../models/account-model';

export interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}

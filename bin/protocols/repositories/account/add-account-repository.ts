import { AddAccountModel } from '../../../../modules/account/usecases/add-account/add-account';
import { AccountModel } from '../../../../modules/account/models/account-model';

export interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}

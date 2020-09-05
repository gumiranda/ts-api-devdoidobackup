import { LoadAccountByToken } from '@/bin/middlewares/protocols/usecases/load-account-by-token';
import { AccountModel } from '../../models/account-model';
import { mockFakeAccount } from '../../models/mocks/mock-account';
import { AddAccount, AddAccountModel } from '../add-account/add-account';

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    accountModel = mockFakeAccount();
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(this.accountModel));
    }
  }
  return new LoadAccountByTokenStub();
};

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    accountModel = mockFakeAccount();
    async add(account: AddAccountModel): Promise<AccountModel> {
      //this.accountModel = { _id: this.accountModel._id, ...account };
      return new Promise((resolve) => resolve(this.accountModel));
    }
  }
  return new AddAccountStub();
};

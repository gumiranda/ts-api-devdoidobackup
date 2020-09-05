import { LoadAccountByToken } from '@/bin/middlewares/protocols/usecases/load-account-by-token';
import { AccountModel } from '../../models/account-model';
import { mockFakeAccount } from '../../models/mocks/mock-account';
import { AddAccount, AddAccountModel } from '../add-account/add-account';

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(mockFakeAccount()));
    }
  }
  return new LoadAccountByTokenStub();
};

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(mockFakeAccount()));
    }
  }
  return new AddAccountStub();
};

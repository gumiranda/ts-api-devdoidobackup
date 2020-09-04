import { LoadAccountByToken } from '@/bin/middlewares/protocols/usecases/load-account-by-token';
import { AccountModel } from '../../models/account-model';
import { makeFakeAccount } from '../../models/mocks/mock-account';
import { AddAccount, AddAccountModel } from '../add-account/add-account';

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenStub();
};

export const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountStub();
};

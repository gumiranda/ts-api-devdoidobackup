import { LoadAccountByToken } from '@/bin/middlewares/protocols/usecases/load-account-by-token';
import { AccountModel, AccountsPaginate } from '../../models/account-model';
import {
  mockFakeAccount,
  mockFakeAccountsPaginated,
  makeFakeArrayAccounts,
} from '../../models/mocks/mock-account';
import { AddAccount, AddAccountModel } from '../add-account/add-account';
import { LoadAccountByPage } from '../load-account-by-page/load-account-by-page';
import { LoadAccountByPageRepository } from '../../repositories/protocols/load-account-by-page-repository';

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    accountModel = mockFakeAccount();
    accessToken: string;
    role: string;
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      this.accessToken = accessToken;
      this.role = role;
      return new Promise((resolve) => resolve(this.accountModel));
    }
  }
  return new LoadAccountByTokenStub();
};
export const mockLoadAccountByPageRepository = (): LoadAccountByPageRepository => {
  class LoadAccountByPageStub implements LoadAccountByPageRepository {
    accounts = makeFakeArrayAccounts();
    page: number;
    accountId: string;
    async loadByPage(page: number, accountId: string): Promise<AccountModel[]> {
      this.accountId = accountId;
      this.page = page;
      return new Promise((resolve) => resolve(this.accounts.slice(0, 10)));
    }
    async countAccountsByPage(
      page: number,
      accountId: string,
    ): Promise<number> {
      this.accountId = accountId;
      this.page = page;
      return new Promise((resolve) => resolve(this.accounts.length));
    }
  }
  return new LoadAccountByPageStub();
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
export const mockLoadAccountByPage = (): LoadAccountByPage => {
  class LoadAccountByPageStub implements LoadAccountByPage {
    accounts = makeFakeArrayAccounts();
    page: number;
    accountId: string;
    loadByPage(page: number, accountId: string): Promise<AccountsPaginate> {
      this.page = page;
      this.accountId = accountId;
      return new Promise((resolve) =>
        resolve({
          accounts: this.accounts.slice(0, 10),
          accountsCount: this.accounts.length,
        }),
      );
    }
  }
  return new LoadAccountByPageStub();
};

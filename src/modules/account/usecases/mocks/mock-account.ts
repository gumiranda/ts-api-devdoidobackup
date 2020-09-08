import { LoadAccountByToken } from '@/modules/account/usecases/load-account-by-token/load-account-by-token';
import {
  AccountModel,
  AccountsPaginate,
  UserData,
} from '@/modules/account/models/account-model';
import {
  mockFakeAccount,
  makeFakeArrayAccounts,
  mockFakeAccountUpdated,
  mockFakeAccountPassword,
} from '@/modules/account/models/mocks/mock-account';
import {
  AddAccount,
  AddAccountModel,
} from '@/modules/account/usecases/add-account/add-account';
import { LoadAccountByPage } from '@/modules/account/usecases/load-account-by-page/load-account-by-page';
import { LoadAccountByPageRepository } from '@/modules/account/repositories/protocols/load-account-by-page-repository';
import { UpdateAccount } from '../update-account/update-account';
import { LoadAccountByIdRepository } from '../../repositories/protocols/load-account-by-id-repository';
import { UpdatePassword } from '../update-password/update-password';

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
export const mockUpdateAccount = (): UpdateAccount => {
  class UpdateAccountStub implements UpdateAccount {
    accountModel = mockFakeAccountUpdated();
    async updateAccount(
      account: UserData,
      accountId: string,
    ): Promise<Omit<AccountModel, 'password'>> {
      return new Promise((resolve) => resolve(this.accountModel));
    }
  }
  return new UpdateAccountStub();
};
export const mockUpdatePassword = (): UpdatePassword => {
  class UpdatePasswordStub implements UpdatePassword {
    accountModel = mockFakeAccountPassword();
    async updatePassword(
      newPassword: string,
      oldPassword: string,
      accountId: string,
    ): Promise<Omit<AccountModel, 'password'>> {
      return new Promise((resolve) => resolve(this.accountModel));
    }
  }
  return new UpdatePasswordStub();
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

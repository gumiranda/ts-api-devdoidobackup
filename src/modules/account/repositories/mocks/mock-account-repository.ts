import {
  mockFakeAccount,
  mockFakeAccountUpdated,
  makeFakeArrayAccounts,
} from '@/modules/account/models/mocks/mock-account';
import { AddAccountRepository } from '@/modules/account/repositories/protocols/add-account-repository';
import { AddAccountModel } from '@/modules/account/usecases/add-account/add-account';
import { AccountModel, UserData } from '@/modules/account/models/account-model';
import { LoadAccountByEmailRepository } from '@/modules/account/repositories/protocols/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '@/modules/account/repositories/protocols/load-account-by-token-repository';
import { addDay } from '@/bin/utils/date-fns';
import { UpdateAccountRepository } from '../protocols/update-account-repository';
import { LoadAccountByPageRepository } from '../protocols/load-account-by-page-repository';
import { LoadAccountByIdRepository } from '../protocols/load-account-by-id-repository';
import { UpdatePasswordRepository } from '../protocols/update-password-repository';
export const mockAddAccountRepository = (): AddAccountRepository => {
  //  accountModel = mockFakeAccount();
  class AddAccountRepositoryStub implements AddAccountRepository {
    accountModel = mockFakeAccount();
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(this.accountModel));
    }
  }
  return new AddAccountRepositoryStub();
};
export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(null));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};
export const mockLoadAccountByEmailRepositoryNotNull = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    accountModel = {
      _id: 'any_id',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      payDay: addDay(new Date(), 7),
    };
    async loadByEmail(email: string): Promise<AccountModel> {
      this.accountModel = {
        _id: 'any_id',
        name: 'any_name',
        email,
        password: 'any_password',
        payDay: addDay(new Date(), 7),
      };
      return new Promise((resolve) => resolve(this.accountModel));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};
export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository {
    role: string;
    token: string;
    accountModel = mockFakeAccount();
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      this.token = token;
      this.role = role;
      return new Promise((resolve) => resolve(this.accountModel));
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};
export const mockUpdateAccountRepository = (): UpdateAccountRepository => {
  //  accountModel = mockFakeAccount();
  class UpdateAccountRepositoryStub implements UpdateAccountRepository {
    async updateOne(
      userData: UserData,
      accountId: string,
    ): Promise<Omit<AccountModel, 'password'>> {
      return new Promise((resolve) => resolve(this.accountModel));
    }
    accountModel = mockFakeAccountUpdated();
  }
  return new UpdateAccountRepositoryStub();
};
export const mockUpdatePasswordRepository = (): UpdatePasswordRepository => {
  //  accountModel = mockFakeAccount();
  class UpdatePasswordRepositoryStub implements UpdatePasswordRepository {
    async updatePassword(
      newPassword: string,
      accountId: string,
    ): Promise<Omit<AccountModel, 'password'>> {
      return new Promise((resolve) => resolve(this.accountModel));
    }
    accountModel = mockFakeAccountUpdated();
  }
  return new UpdatePasswordRepositoryStub();
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
export const mockLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdStub implements LoadAccountByIdRepository {
    accountModel = mockFakeAccount();
    _id: string;
    async loadById(_id: string): Promise<AccountModel> {
      this._id = _id;
      if (this.accountModel !== null) {
        this.accountModel._id = _id;
      }
      return new Promise((resolve) => resolve(this.accountModel));
    }
  }
  return new LoadAccountByIdStub();
};

import { AddAccountRepository } from '../protocols/add-account-repository';
import { AddAccountModel } from '../../usecases/add-account/add-account';
import { AccountModel } from '../../models/account-model';
import { LoadAccountByEmailRepository } from '../protocols/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '../protocols/load-account-by-token-repository';
import { makeFakeAccount } from '../../models/mocks/mock-account';

export const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountRepositoryStub();
};
export const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(null));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};
export const makeLoadAccountByEmailRepositoryNotNull = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      const account = {
        _id: 'any_id',
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
      };
      return new Promise((resolve) => resolve(account));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};
export const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};
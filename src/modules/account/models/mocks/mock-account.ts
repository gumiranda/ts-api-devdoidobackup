import { AddAccountModel } from '../../usecases/add-account/add-account';
import { AccountModel, AccountsPaginate } from '../account-model';

export const mockFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role: 'client',
});
export const mockFakeAccount = (): AccountModel => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role: 'client',
});
export const mockFakeAccountsPaginated = (): AccountsPaginate => ({
  accounts: makeFakeArrayAccounts().slice(0, 10),
  accountsCount: makeFakeArrayAccounts().length,
});
export const makeFakeArrayAccounts = (): AccountModel[] => [
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
  mockFakeAccount(),
];
export const makeFakeArrayAddAccounts = (): AddAccountModel[] => [
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
  mockFakeAccountData(),
];

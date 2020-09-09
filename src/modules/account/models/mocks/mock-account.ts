import { AddAccountModel } from '@/modules/account/usecases/add-account/add-account';
import {
  AccountModel,
  AccountsPaginate,
  UserData,
} from '@/modules/account/models/account-model';
import { addDay } from '@/bin/utils/date-fns';
export const mockFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role: 'client',
  coord: [25.0000188, -71.0087548],
  payDay: addDay(new Date(), 7),
});
export const mockFakeAccount = (): AccountModel => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role: 'client',
  coord: [25.0000188, -71.0087548],
  payDay: addDay(new Date(), 7),
});
export const mockFakeAccountPassword = (): Omit<AccountModel, 'password'> => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  role: 'client',
  coord: [25.0000188, -71.0087548],
  payDay: addDay(new Date(), 7),
});
export const mockFakeAccountUpdated = (): Omit<AccountModel, 'password'> => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  role: 'client',
  cpf: 'any_cpf',
  phone: 'any_phone',
  coord: [25.0000188, -71.0087548],
  payDay: addDay(new Date(), 7),
});
export const mockFakeAccountPasswordUpdated = (): Omit<
  AccountModel,
  'password'
> => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  role: 'client',
  coord: [25.0000188, -71.0087548],
  payDay: addDay(new Date(), 7),
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
export const mockFakeUpdateAccountData = (): UserData => ({
  cpf: 'any_cpf',
  phone: 'any_phone',
});
export const mockFakeAccountWithPasswordHashed = (
  password: string,
): Omit<AccountModel, '_id'> => ({
  coord: [25.0000188, -71.0087548],
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password,
  role: 'client',
  payDay: addDay(new Date(), 7),
});

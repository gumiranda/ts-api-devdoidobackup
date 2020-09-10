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
  createdAt: new Date(),
  coord: [43.6589, -67.0087548],
  payDay: addDay(new Date(), 7),
});
export const mockFakeAccount = (): AccountModel => ({
  _id: 'valid_id',
  name: 'valid_name',
  coord: {
    type: 'Point',
    coordinates: [43.6589, -67.0087548],
  },
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role: 'client',
  createdAt: new Date(),
  payDay: addDay(new Date(), 7),
});
export const mockFakeAccountPassword = (): Omit<AccountModel, 'password'> => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  role: 'client',
  createdAt: new Date(),
  coord: {
    type: 'Point',
    coordinates: [43.6589, -67.0087548],
  },
  payDay: addDay(new Date(), 7),
});
export const mockFakeAccountUpdated = (): Omit<AccountModel, 'password'> => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  role: 'client',
  cpf: 'any_cpf',
  phone: 'any_phone',
  createdAt: new Date(),
  coord: {
    type: 'Point',
    coordinates: [43.6589, -67.0087548],
  },
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
  createdAt: new Date(),
  coord: {
    type: 'Point',
    coordinates: [43.6589, -67.0087548],
  },
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
  coord: [43.6589, -67.0087548],
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password,
  createdAt: new Date(),
  role: 'client',
  payDay: addDay(new Date(), 7),
});

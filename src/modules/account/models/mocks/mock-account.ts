import { AddAccountModel } from '@/modules/account/usecases/add-account/add-account';
import {
  AccountModel,
  AccountsPaginate,
  UserData,
} from '@/modules/account/models/account-model';
import { addDay } from '@/bin/utils/date-fns';
export const mockFakeAccountData = (role: string): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role,
  createdAt: new Date(),
  coord: [43.6589, -67.0087548],
  payDay: addDay(new Date(), 7),
});
export const mockFakeAccount = (role: string): AccountModel => ({
  _id: 'valid_id',
  name: 'valid_name',
  coord: {
    type: 'Point',
    coordinates: [43.6589, -67.0087548],
  },
  plan: 'basic',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role,
  createdAt: new Date(),
  payDay: addDay(new Date(), 7),
});
export const mockFakeAccountPassword = (
  role: string,
): Omit<AccountModel, 'password'> => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  role,
  createdAt: new Date(),
  coord: {
    type: 'Point',
    coordinates: [43.6589, -67.0087548],
  },
  payDay: addDay(new Date(), 7),
});
export const mockFakeAccountUpdated = (
  role: string,
): Omit<AccountModel, 'password'> => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  role,
  cpf: 'any_cpf',
  phone: 'any_phone',
  createdAt: new Date(),
  coord: {
    type: 'Point',
    coordinates: [43.6589, -67.0087548],
  },
  payDay: addDay(new Date(), 7),
});
export const mockFakeAccountPasswordUpdated = (
  role: string,
): Omit<AccountModel, 'password'> => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  role,
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
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
  mockFakeAccount('client'),
];
export const makeFakeArrayAddAccounts = (): AddAccountModel[] => [
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
  mockFakeAccountData('client'),
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

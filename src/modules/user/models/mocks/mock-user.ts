import { AddUserModel } from '@/modules/user/usecases/add-user/add-user';
import {
  UserModel,
  UsersPaginate,
  UserData,
} from '@/modules/user/models/user-model';
import { addDay } from '@/bin/utils/date-fns';
export const mockFakeUserData = (role: string): AddUserModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role,
  createdAt: new Date(),
  coord: [43.6589, -67.0087548],
  payDay: addDay(new Date(), 7),
});
export const mockFakeUser = (role: string): UserModel => ({
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
export const mockFakeUserPassword = (
  role: string,
): Omit<UserModel, 'password'> => ({
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
export const mockFakeUserUpdated = (
  role: string,
): Omit<UserModel, 'password'> => ({
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
export const mockFakeUserPasswordUpdated = (
  role: string,
): Omit<UserModel, 'password'> => ({
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
export const mockFakeUsersPaginated = (): UsersPaginate => ({
  users: makeFakeArrayUsers().slice(0, 10),
  usersCount: makeFakeArrayUsers().length,
});
export const makeFakeArrayUsers = (): UserModel[] => [
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
  mockFakeUser('client'),
];
export const makeFakeArrayAddUsers = (): AddUserModel[] => [
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
  mockFakeUserData('client'),
];
export const mockFakeUpdateUserData = (): UserData => ({
  cpf: 'any_cpf',
  phone: 'any_phone',
});
export const mockFakeUserWithPasswordHashed = (
  password: string,
): Omit<UserModel, '_id'> => ({
  coord: [43.6589, -67.0087548],
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password,
  createdAt: new Date(),
  role: 'client',
  payDay: addDay(new Date(), 7),
});

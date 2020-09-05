import { AddAccountModel } from '../../usecases/add-account/add-account';
import { AccountModel } from '../account-model';

export const mockFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});
export const mockFakeAccount = (): AccountModel => ({
  _id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role: 'client',
});

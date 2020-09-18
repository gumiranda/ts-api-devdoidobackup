import { UserModel } from '@/modules/user/models/user-model';

export type AddUserModel = Omit<UserModel, '_id'>;

export type AddUser = {
  add(user: AddUserModel): Promise<UserModel>;
};

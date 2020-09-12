import { UserData, UserModel } from '@/modules/user/models/user-model';

export type UpdateUser = {
  updateUser(
    data: UserData,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>>;
};

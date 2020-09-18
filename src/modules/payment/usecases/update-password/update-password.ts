import { UserModel } from '../../models/user-model';

export interface UpdatePassword {
  updatePassword(
    newPassword: string,
    oldPassword: string,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>>;
}

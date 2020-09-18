import { UserModel } from '../../models/card-model';

export interface UpdatePassword {
  updatePassword(
    newPassword: string,
    oldPassword: string,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>>;
}

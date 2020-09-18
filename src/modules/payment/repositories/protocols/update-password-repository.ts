import { UserModel } from '../../models/user-model';

export interface UpdatePasswordRepository {
  updatePassword(
    newPassword: string,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>>;
}

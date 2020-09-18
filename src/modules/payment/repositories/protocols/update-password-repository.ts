import { UserModel } from '../../models/card-model';

export interface UpdatePasswordRepository {
  updatePassword(
    newPassword: string,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>>;
}

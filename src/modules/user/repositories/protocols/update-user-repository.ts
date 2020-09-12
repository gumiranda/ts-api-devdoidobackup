import { UserData, UserModel } from '../../models/user-model';

export interface UpdateUserRepository {
  updateOne(
    userData: UserData,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>>;
}

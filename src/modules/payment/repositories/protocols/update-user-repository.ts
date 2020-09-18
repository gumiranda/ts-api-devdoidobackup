import { UserData, UserModel } from '../../models/card-model';

export interface UpdateUserRepository {
  updateOne(
    userData: UserData,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>>;
}

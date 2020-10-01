import { UserDataOwner, UserModel } from '../../models/user-model';

export interface UpdateUserRepository {
  userModel: any;
  updateOne(
    userData: UserDataOwner,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>>;
}

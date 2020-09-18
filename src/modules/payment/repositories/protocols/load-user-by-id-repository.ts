import { UserModel } from '@/modules/user/models/user-model';

export interface LoadUserByIdRepository {
  userModel: UserModel;
  _id: string;
  loadById(_id: string): Promise<UserModel>;
}

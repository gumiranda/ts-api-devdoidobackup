import { AddUserModel } from '@/modules/user/usecases/add-user/add-user';
import { UserModel } from '@/modules/user/models/user-model';

export interface AddUserRepository {
  add(userData: AddUserModel): Promise<UserModel>;
}

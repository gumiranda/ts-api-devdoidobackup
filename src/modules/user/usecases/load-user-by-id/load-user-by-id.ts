import { UserModel } from '@/modules/user/models/user-model';

export interface LoadUserById {
  loadById(_id: string): Promise<UserModel>;
}

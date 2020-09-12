import { UserModel } from '@/modules/user/models/user-model';

export interface LoadUserByEmailRepository {
  loadByEmail(email: string): Promise<UserModel>;
}

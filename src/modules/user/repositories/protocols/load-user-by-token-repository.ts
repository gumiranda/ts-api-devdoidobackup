import { UserModel } from '@/modules/user/models/user-model';

export interface LoadUserByTokenRepository {
  userModel: UserModel;
  role: string;
  token: string;
  loadByToken(token: string, role?: string): Promise<UserModel>;
}

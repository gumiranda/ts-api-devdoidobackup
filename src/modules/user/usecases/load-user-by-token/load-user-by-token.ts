import { UserModel } from '@/modules/user/models/user-model';

export interface LoadUserByToken {
  load(accessToken: string, role?: string): Promise<UserModel>;
}

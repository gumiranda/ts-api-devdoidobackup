import { UserModel } from '@/modules/user/models/user-model';

export interface LoadUserByPageRepository {
  loadByPage(
    page: number,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>[]>;
  countUsersByPage(page: number, userId: string): Promise<number>;
}

import { UserModel } from '@/modules/user/models/user-model';

export interface UpdatePayDay {
  userModel: any;
  updatePayDay(
    userId: string,
    numberDays: Number,
  ): Promise<Omit<UserModel, 'password'>>;
}

import { UpdatePayDay } from '../update-pay-day';
import { addDay } from '@/bin/utils/date-fns';
import { UpdateUserRepository } from '@/modules/user/repositories/protocols/update-user-repository';
import { UserModel } from '@/modules/user/models/user-model';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';

export class DbUpdatePayDay implements UpdatePayDay {
  constructor(
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
  ) {}
  userModel: any;
  async updatePayDay(
    userId: string,
    numberDays: Number,
  ): Promise<Omit<UserModel, 'password'>> {
    const user = await this.loadUserByIdRepository.loadById(userId);
    if (user) {
      const payDay = addDay(new Date(user.payDay), numberDays);
      const userUpdated = await this.updateUserRepository.updateOne(
        { payDay },
        userId,
      );
      if (userUpdated) {
        return userUpdated;
      }
    }
    return null;
  }
}

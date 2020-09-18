import { UpdateUserRepository } from '@/modules/user/repositories/protocols/update-user-repository';
import { UserModel, UserData } from '@/modules/user/models/user-model';
import { UpdateUser } from '../update-user';

export class DbUpdateUser implements UpdateUser {
  constructor(private readonly updateUserRepository: UpdateUserRepository) {}
  async updateUser(
    data: UserData,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>> {
    const userResult = await this.updateUserRepository.updateOne(data, userId);
    return userResult;
  }
}

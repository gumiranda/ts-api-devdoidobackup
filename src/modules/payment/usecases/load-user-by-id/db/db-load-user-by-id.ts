import { LoadUserById } from '../load-user-by-id';
import { UserModel } from '@/modules/user/models/user-model';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';

export class DbLoadUserById implements LoadUserById {
  constructor(
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
  ) {}
  async loadById(_id: string): Promise<UserModel> {
    if (_id) {
      const user = await this.loadUserByIdRepository.loadById(_id);
      if (user) {
        return user;
      }
    }
    return null;
  }
}

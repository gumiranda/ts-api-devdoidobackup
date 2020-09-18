import { LoadUserByPageRepository } from '@/modules/user/repositories/protocols/load-user-by-page-repository';
import { LoadUserByPage } from '@/modules/user/usecases/load-user-by-page/load-user-by-page';
import { UsersPaginate } from '@/modules/user/models/user-model';

export class DbLoadUserByPage implements LoadUserByPage {
  constructor(private readonly loadUserRepository: LoadUserByPageRepository) {}
  async loadByPage(page: number, userId: string): Promise<UsersPaginate> {
    const users = await this.loadUserRepository.loadByPage(page, userId);
    const usersCount = await this.loadUserRepository.countUsersByPage(
      page,
      userId,
    );
    return { users, usersCount };
  }
}

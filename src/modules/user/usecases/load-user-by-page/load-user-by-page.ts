import { UsersPaginate } from '@/modules/user/models/user-model';

export interface LoadUserByPage {
  loadByPage(
    page: number,
    userId: string,
    typeUser: string,
  ): Promise<UsersPaginate>;
}

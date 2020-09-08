import { LoadAccountById } from '../load-account-by-id';
import { AccountModel } from '@/modules/account/models/account-model';
import { LoadAccountByIdRepository } from '@/modules/account/repositories/protocols/load-account-by-id-repository';

export class DbLoadAccountById implements LoadAccountById {
  constructor(
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
  ) {}
  async loadById(_id: string): Promise<AccountModel> {
    if (_id) {
      const account = await this.loadAccountByIdRepository.loadById(_id);
      if (account) {
        return account;
      }
    }
    return null;
  }
}

import { LoadAccountByPageRepository } from '@/modules/account/repositories/protocols/load-account-by-page-repository';
import { LoadAccountByPage } from '@/modules/account/usecases/load-account-by-page/load-account-by-page';
import { AccountsPaginate } from '@/modules/account/models/account-model';

export class DbLoadAccountByPage implements LoadAccountByPage {
  constructor(
    private readonly loadAccountRepository: LoadAccountByPageRepository,
  ) {}
  async loadByPage(page: number, accountId: string): Promise<AccountsPaginate> {
    const accounts = await this.loadAccountRepository.loadByPage(
      page,
      accountId,
    );
    const accountsCount = await this.loadAccountRepository.countAccountsByPage(
      page,
      accountId,
    );
    return { accounts, accountsCount };
  }
}

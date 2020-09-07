import { UpdateAccountRepository } from '@/modules/account/repositories/protocols/update-account-repository';
import { AccountModel, UserData } from '@/modules/account/models/account-model';
import { UpdateAccount } from '../update-account';

export class DbUpdateAccount implements UpdateAccount {
  constructor(
    private readonly updateAccountRepository: UpdateAccountRepository,
  ) {}
  async updateAccount(
    data: UserData,
    accountId: string,
  ): Promise<Omit<AccountModel, 'password'>> {
    const accountResult = await this.updateAccountRepository.updateOne(
      data,
      accountId,
    );
    return accountResult;
  }
}

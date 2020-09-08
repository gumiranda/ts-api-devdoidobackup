import { UpdatePasswordRepository } from '@/modules/account/repositories/protocols/update-password-repository';
import { UpdatePassword } from '../update-password';
import { HashComparer } from '@/bin/protocols/crypto/hash-comparer';
import { AccountModel } from '@/modules/account/models/account-model';
import { LoadAccountByIdRepository } from '@/modules/account/repositories/protocols/load-account-by-id-repository';

export class DbUpdatePassword implements UpdatePassword {
  private readonly updatePasswordRepository: UpdatePasswordRepository;
  private readonly hashComparer: HashComparer;
  private readonly loadAccountByIdRepository: LoadAccountByIdRepository;
  constructor(
    updatePasswordRepository: UpdatePasswordRepository,
    loadAccountByIdRepository: LoadAccountByIdRepository,
    hashComparer: HashComparer,
  ) {
    this.updatePasswordRepository = updatePasswordRepository;
    this.loadAccountByIdRepository = loadAccountByIdRepository;
    this.hashComparer = hashComparer;
  }
  async updatePassword(
    newPassword: string,
    oldPassword: string,
    accountId: string,
  ): Promise<Omit<AccountModel, 'password'>> {
    const account = await this.loadAccountByIdRepository.loadById(accountId);
    if (account) {
      const isValid = await this.hashComparer.compare(
        oldPassword,
        account.password,
      );
      if (isValid) {
        const accountUpdatedPassword = await this.updatePasswordRepository.updatePassword(
          newPassword,
          accountId,
        );
        return accountUpdatedPassword;
      }
    }
    return null;
  }
}

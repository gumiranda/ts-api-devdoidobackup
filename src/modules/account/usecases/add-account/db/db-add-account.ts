import {
  AddAccount,
  AddAccountModel,
} from '@/modules/account/usecases/add-account/add-account';
import { Encrypter } from '@/bin/protocols/crypto/encrypter';
import { AddAccountRepository } from '@/modules/account/repositories/protocols/add-account-repository';
import { AccountModel } from '@/modules/account/models/account-model';
import { LoadAccountByEmailRepository } from '@/modules/account/repositories/protocols/load-account-by-email-repository';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddAccountRepository;
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  constructor(
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository,
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email,
    );
    if (!account) {
      const hashedPassword = await this.encrypter.encrypt(accountData.password);
      const newAccount = await this.addAccountRepository.add(
        Object.assign({}, accountData, { password: hashedPassword }),
      );
      return newAccount;
    }
    return null;
  }
}

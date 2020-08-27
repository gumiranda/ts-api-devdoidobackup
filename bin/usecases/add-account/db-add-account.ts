import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Encrypter,
  AddAccountRepository,
} from './db-add-account-protocols';
import { LoadAccountByEmailRepository } from '../auth/db-authentication-protocols';

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
    //if (!account) {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    const newAccount = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword }),
    );
    return newAccount;
    //}
    //return null
  }
}

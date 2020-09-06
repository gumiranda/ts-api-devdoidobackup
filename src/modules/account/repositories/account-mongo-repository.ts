import { AddAccountRepository } from './protocols/add-account-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { AddAccountModel } from '@/modules/account/usecases/add-account/add-account';
import { AccountModel } from '@/modules/account/models/account-model';
import { ObjectId } from 'mongodb';
import { LoadAccountByEmailRepository } from './protocols/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from './protocols/load-account-by-token-repository';
import variables from '@/bin/configuration/variables';
import jwt from 'jsonwebtoken';
import { LoadAccountByPageRepository } from './protocols/load-account-by-page-repository';
import { MongoRepository } from '@/bin/base/mongo-repository';
export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    LoadAccountByPageRepository,
    LoadAccountByTokenRepository {
  constructor(private readonly mongoRepository: MongoRepository) {}
  async countAccountsByPage(page: number, accountId: string): Promise<number> {
    const accountsCount = await this.mongoRepository.getCount({
      role: 'client',
      _id: { $ne: new ObjectId(accountId) },
    });
    return accountsCount;
  }
  async loadByPage(page: number, accountId: string): Promise<AccountModel[]> {
    const accounts = await this.mongoRepository.getPaginate(
      page,
      { role: 'client', _id: { $ne: new ObjectId(accountId) } },
      { date: -1 },
      10,
    );

    return accounts;
  }
  accountModel: AccountModel;
  role: string;
  token: string;
  async loadByToken(token: string, role: string): Promise<AccountModel> {
    const decoded: any = await jwt.verify(token, variables.Security.secretKey);
    const { _id } = decoded;
    let query: any = { _id: new ObjectId(_id) };
    if (role) {
      query.role = role;
    }
    const result = await this.mongoRepository.getOne(query);
    return result && MongoHelper.mapPassword(result);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const result = await this.mongoRepository.getOne({ email });
    return result;
  }
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const result = await this.mongoRepository.add(accountData);
    return result && MongoHelper.mapPassword(result);
  }
}

import { AddAccountRepository } from './protocols/add-account-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { AddAccountModel } from '../usecases/add-account/add-account';
import { AccountModel } from '../models/account-model';
import { ObjectId } from 'mongodb';
import { LoadAccountByEmailRepository } from './protocols/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from './protocols/load-account-by-token-repository';
import variables from '@/bin/configuration/variables';
import jwt from 'jsonwebtoken';
import { LoadAccountByPageRepository } from './protocols/load-account-by-page-repository';
export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    LoadAccountByPageRepository,
    LoadAccountByTokenRepository {
  async countAccountsByPage(page: number, accountId: string): Promise<number> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const accountsCount = await accountCollection
      .find({ role: 'client', _id: { $ne: new ObjectId(accountId) } })
      .count();
    return accountsCount;
  }
  async loadByPage(page: number, accountId: string): Promise<AccountModel[]> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const accounts = await accountCollection
      .find({ role: 'client', _id: { $ne: new ObjectId(accountId) } })
      .skip((page - 1) * 10)
      .limit(10)
      .sort({ date: -1 })
      .toArray();
    return accounts;
  }
  accountModel: AccountModel;
  role: string;
  token: string;
  async loadByToken(token: string, role: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const decoded: any = await jwt.verify(token, variables.Security.secretKey);
    const { _id } = decoded;
    let query: any = { _id: new ObjectId(_id) };
    if (role) {
      query.role = role;
    }
    const result = await accountCollection.findOne(query);
    return result && MongoHelper.mapPassword(result);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.findOne({ email });
    return result;
  }
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    return result && MongoHelper.mapPassword(result.ops[0]);
  }
}

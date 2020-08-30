import { AddAccountRepository } from './protocols/add-account-repository';
import { MongoHelper } from '../../../bin/helpers/db/mongo/mongo-helper';
import { AddAccountModel } from '../usecases/add-account/add-account';
import { AccountModel } from '../models/account-model';
import { ObjectId } from 'mongodb';
import { LoadAccountByEmailRepository } from './protocols/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from './protocols/load-account-by-token-repository';
import variables from '../../../bin/configuration/variables';
import jwt from 'jsonwebtoken';
export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    LoadAccountByTokenRepository {
  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const decoded: any = await jwt.verify(token, variables.Security.secretKey);
    const { _id } = decoded;
    const result = await accountCollection.findOne({ _id: new ObjectId(_id) });
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

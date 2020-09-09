import { AddAccountRepository } from './protocols/add-account-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { AddAccountModel } from '@/modules/account/usecases/add-account/add-account';
import { AccountModel, UserData } from '@/modules/account/models/account-model';
import { ObjectId } from 'mongodb';
import { LoadAccountByEmailRepository } from './protocols/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from './protocols/load-account-by-token-repository';
import variables from '@/bin/configuration/variables';
import jwt from 'jsonwebtoken';
import { LoadAccountByPageRepository } from './protocols/load-account-by-page-repository';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import { UpdateAccountRepository } from './protocols/update-account-repository';
import { UpdatePasswordRepository } from './protocols/update-password-repository';
import { LoadAccountByIdRepository } from './protocols/load-account-by-id-repository';
import { QueryBuilder } from '@/bin/helpers/query-builder';
export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    LoadAccountByPageRepository,
    UpdatePasswordRepository,
    UpdateAccountRepository,
    LoadAccountByIdRepository,
    LoadAccountByTokenRepository {
  accountModel: AccountModel;
  role: string;
  token: string;
  constructor(private readonly mongoRepository: MongoRepository) {}
  _id: string;
  async loadById(_id: string): Promise<AccountModel> {
    const result = await this.mongoRepository.getById(_id);
    return result;
  }
  async countAccountsByPage(page: number, accountId: string): Promise<number> {
    const accountsCount = await this.mongoRepository.getCount({
      role: 'client',
      _id: { $ne: new ObjectId(accountId) },
    });
    return accountsCount;
  }
  async loadByPage(
    page: number,
    accountId: string,
  ): Promise<Omit<AccountModel, 'password'>[]> {
    const userLogged = await this.mongoRepository.getById(accountId);
    console.log(userLogged);
    const query = new QueryBuilder()
      .geoNear({
        near: { type: 'Point', coordinates: userLogged.coord.coordinates },
        query: { role: 'client' },
        distanceField: 'distance',
        maxDistance: 100000,
        spherical: true,
      })
      .sort({ distance: 1 })
      .skip((page - 1) * 10)
      .limit(10)
      .project({ password: 0 })
      .build();
    console.warn(query);
    const accounts = await this.mongoRepository.aggregate(query);
    console.warn(accounts);
    return accounts;
  }
  async loadByPageBackup(
    page: number,
    accountId: string,
  ): Promise<Omit<AccountModel, 'password'>[]> {
    const accounts = await this.mongoRepository.getPaginate(
      page,
      { role: 'client', _id: { $ne: new ObjectId(accountId) } },
      { createdAt: -1 },
      10,
      { password: 0 },
    );
    return accounts;
  }
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
    await this.mongoRepository.createIndex({ coord: '2dsphere' });
    return result && MongoHelper.mapPassword(result);
  }
  async updateOne(
    userData: UserData,
    accountId: string,
  ): Promise<Omit<AccountModel, 'password'>> {
    const { cpf, phone } = userData;
    await this.mongoRepository.updateOne(
      {
        _id: new ObjectId(accountId),
      },
      {
        $set: {
          cpf,
          phone,
        },
      },
      { upsert: true },
    );
    const result = await this.mongoRepository.getOne({ _id: accountId });
    return result && MongoHelper.mapPassword(result);
  }
  async updatePassword(
    newPassword: string,
    accountId: string,
  ): Promise<Omit<AccountModel, 'password'>> {
    const userUpdated = await this.mongoRepository.findOneAndUpdate(
      {
        _id: new ObjectId(accountId),
      },
      {
        $set: {
          password: newPassword,
        },
      },
      { upsert: true },
    );
    return userUpdated.value;
  }
}

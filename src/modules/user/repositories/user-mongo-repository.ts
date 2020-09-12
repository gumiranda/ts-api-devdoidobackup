import { AddUserRepository } from './protocols/add-user-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { AddUserModel } from '@/modules/user/usecases/add-user/add-user';
import { UserModel, UserData } from '@/modules/user/models/user-model';
import { ObjectId } from 'mongodb';
import { LoadUserByEmailRepository } from './protocols/load-user-by-email-repository';
import { LoadUserByTokenRepository } from './protocols/load-user-by-token-repository';
import variables from '@/bin/configuration/variables';
import jwt from 'jsonwebtoken';
import { LoadUserByPageRepository } from './protocols/load-user-by-page-repository';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import { UpdateUserRepository } from './protocols/update-user-repository';
import { UpdatePasswordRepository } from './protocols/update-password-repository';
import { LoadUserByIdRepository } from './protocols/load-user-by-id-repository';
import { QueryBuilder } from '@/bin/helpers/query-builder';
export class UserMongoRepository
  implements
    AddUserRepository,
    LoadUserByEmailRepository,
    LoadUserByPageRepository,
    UpdatePasswordRepository,
    UpdateUserRepository,
    LoadUserByIdRepository,
    LoadUserByTokenRepository {
  userModel: UserModel;
  role: string;
  token: string;
  constructor(private readonly mongoRepository: MongoRepository) {}
  _id: string;
  async loadById(_id: string): Promise<UserModel> {
    const result = await this.mongoRepository.getById(_id);
    return result;
  }
  async countUsersByPage(page: number, userId: string): Promise<number> {
    const userLogged = await this.mongoRepository.getById(userId);
    const query = new QueryBuilder()
      .geoNear({
        near: { type: 'Point', coordinates: userLogged.coord.coordinates },
        query: { role: 'owner', _id: { $ne: new ObjectId(userId) } },
        distanceField: 'distance',
        maxDistance: 100000,
        spherical: true,
      })
      .count('name')
      .build();
    const usersCount: any = await this.mongoRepository.aggregate(query);
    if (usersCount.length === 0) {
      return 0;
    }
    return await usersCount[0]?.name;
  }
  async loadByPage(
    page: number,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>[]> {
    const userLogged = await this.mongoRepository.getById(userId);
    const query = new QueryBuilder()
      .geoNear({
        near: { type: 'Point', coordinates: userLogged.coord.coordinates },
        query: { role: 'owner', _id: { $ne: new ObjectId(userId) } },
        distanceField: 'distance',
        maxDistance: 100000,
        spherical: true,
      })
      .sort({ distance: 1 })
      .skip((page - 1) * 10)
      .limit(10)
      .project({ password: 0 })
      .build();
    const users = await this.mongoRepository.aggregate(query);
    return users;
  }
  async loadByPageBackup(
    page: number,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>[]> {
    const users = await this.mongoRepository.getPaginate(
      page,
      { role: 'client', _id: { $ne: new ObjectId(userId) } },
      { createdAt: -1 },
      10,
      { password: 0 },
    );
    return users;
  }
  async loadByToken(token: string, role: string): Promise<UserModel> {
    const decoded: any = await jwt.verify(token, variables.Security.secretKey);
    const { _id } = decoded;
    let query: any = { _id: new ObjectId(_id) };
    if (role) {
      query.role = role;
    }
    const result = await this.mongoRepository.getOne(query);
    return result && MongoHelper.mapPassword(result);
  }

  async loadByEmail(email: string): Promise<UserModel> {
    const result = await this.mongoRepository.getOne({ email });
    return result;
  }
  async add(userData: AddUserModel): Promise<UserModel> {
    const result = await this.mongoRepository.add(userData);
    await this.mongoRepository.createIndex({ coord: '2dsphere' });
    return result && MongoHelper.mapPassword(result);
  }
  async updateOne(
    userData: UserData,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>> {
    const { cpf, phone } = userData;
    await this.mongoRepository.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: {
          cpf,
          phone,
        },
      },
      { upsert: true },
    );
    const result = await this.mongoRepository.getOne({ _id: userId });
    return result && MongoHelper.mapPassword(result);
  }
  async updatePassword(
    newPassword: string,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>> {
    const userUpdated = await this.mongoRepository.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
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

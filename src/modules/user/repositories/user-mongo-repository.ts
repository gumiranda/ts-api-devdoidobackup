import { AddUserRepository } from './protocols/add-user-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { AddUserModel } from '@/modules/user/usecases/add-user/add-user';
import { UserDataOwner, UserModel } from '@/modules/user/models/user-model';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import { LoadUserByEmailRepository } from './protocols/load-user-by-email-repository';
import variables from '@/bin/configuration/variables';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { LoadUserByTokenRepository } from './protocols/load-user-by-token-repository';
import { UpdateUserRepository } from './protocols/update-user-repository';
import { UpdatePasswordRepository } from './protocols/update-password-repository';
import { LoadUserByIdRepository } from './protocols/load-user-by-id-repository';
import { LoadUserByPageRepository } from './protocols/load-user-by-page-repository';
import { QueryBuilder } from '@/bin/helpers/query-builder';
import { LoadUserByFaceTokenRepository } from './protocols/load-user-by-face-token-repository';
import { loginFB } from '@/bin/helpers/external-apis/facebook';
export class UserMongoRepository
  implements
    AddUserRepository,
    UpdateUserRepository,
    LoadUserByEmailRepository,
    LoadUserByTokenRepository,
    UpdatePasswordRepository,
    LoadUserByIdRepository,
    LoadUserByFaceTokenRepository,
    LoadUserByPageRepository {
  constructor(private readonly mongoRepository: MongoRepository) {}
  faceId: string;
  faceToken: string;
  _id: string;
  userModel: UserModel;
  role: string;
  token: string;

  async add(userData: AddUserModel): Promise<UserModel> {
    const result = await this.mongoRepository.add(userData);
    await this.mongoRepository.createIndex({ coord: '2dsphere' });
    return result && MongoHelper.mapPassword(result);
  }
  async loadByEmail(email: string): Promise<UserModel> {
    const result: any = await this.mongoRepository.getOne({ email }, {});
    return result;
  }
  async loadByToken(token: string, role: string): Promise<UserModel> {
    const decoded: any = await jwt.verify(token, variables.Security.secretKey);
    const { _id } = decoded;
    let query: any = { _id: new ObjectId(_id) };
    if (role) {
      query.role = role;
    }
    const result: any = await this.mongoRepository.getOne(query, {
      projection: { password: 0 },
    });
    return result;
  }
  async updateOne(
    userData: UserDataOwner,
    userId: string,
  ): Promise<Omit<UserModel, 'password'>> {
    await this.mongoRepository.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: userData,
      },
      { upsert: true },
    );
    const result: any = await this.mongoRepository.getOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } },
    );
    return result;
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
  async loadById(_id: string): Promise<UserModel> {
    const result = await this.mongoRepository.getById(_id);
    return result;
  }
  async countUsersByPage(
    page: number,
    userId: string,
    typeUser: string,
  ): Promise<number> {
    const userLogged = await this.mongoRepository.getById(userId);
    const query = new QueryBuilder()
      .geoNear({
        near: { type: 'Point', coordinates: userLogged.coord.coordinates },
        query: { role: typeUser, _id: { $ne: new ObjectId(userId) } },
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
    typeUser: string,
  ): Promise<Omit<UserModel, 'password'>[]> {
    const userLogged = await this.mongoRepository.getById(userId);
    const query = new QueryBuilder()
      .geoNear({
        near: { type: 'Point', coordinates: userLogged.coord.coordinates },
        query: {
          role: typeUser,
          active: true,
          payDay: { $gte: new Date().toISOString() },
          _id: { $ne: new ObjectId(userId) },
        },
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
  async loadByFaceToken(faceId: string, faceToken: string): Promise<UserModel> {
    const response: any = await loginFB(faceId, faceToken);
    if (response?.data?.id) {
      const result: any = await this.mongoRepository.getOne(
        {
          faceId,
          face: true,
          active: true,
        },
        { projection: { password: 0 } },
      );
      if (result) {
        return result;
      }
      let userData: any = {
        faceId,
        face: true,
        active: true,
        role: 'client',
        createdAt: new Date(),
        payDay: new Date(),
      };
      if (response?.data?.name) {
        userData.name = response.data.name;
        userData.photo_url = response.data.picture.data.url;
      }
      const resultAdd = await this.mongoRepository.add(userData);
      return resultAdd;
    }
  }
}

import { UserMongoRepository } from './transaction-mongo-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
import {
  makeFakeArrayUsers,
  mockFakeUserData,
} from '@/modules/user/models/mocks/mock-user';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import MockDate from 'mockdate';
import variables from '@/bin/configuration/variables';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/card-model';

let userCollection: Collection;

const makeUser = async (): Promise<UserModel> => {
  let user = mockFakeUserData('client');
  user.coord = { type: 'Point', coordinates: user.coord };
  const { ops } = await userCollection.insertOne(user);
  return ops[0];
};
const makeSut = (): UserMongoRepository => {
  const mongoRepository = new MongoRepository('users');
  return new UserMongoRepository(mongoRepository);
};
describe('User Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    userCollection = await MongoHelper.getCollection('users');
    await userCollection.deleteMany({});
  });

  test('Should return an user add success', async () => {
    const sut = makeSut();
    const user = await sut.add(mockFakeUserData('client'));
    expect(user).toBeTruthy();
    expect(user._id).toBeTruthy();
    expect(user.name).toBe('valid_name');
    expect(user.email).toBe('valid_email@mail.com');
  });

  test('Should return an user loadByEmail success', async () => {
    const sut = makeSut();
    await userCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    const user = await sut.loadByEmail('any_email@mail.com');
    expect(user).toBeTruthy();
    expect(user._id).toBeTruthy();
    expect(user.name).toBe('any_name');
    expect(user.email).toBe('any_email@mail.com');
  });
  test('Should return null user if loadByEmail fails', async () => {
    const sut = makeSut();
    const user = await sut.loadByEmail('any_email@mail.com');
    expect(user).toBeFalsy();
  });
  test('Should return null user if loadByEmail fails', async () => {
    const sut = makeSut();
    const user = await sut.loadByEmail('any_email@mail.com');
    expect(user).toBeFalsy();
  });
  test('Should return an user loadByToken success with role', async () => {
    const sut = makeSut();
    const userAdd = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      role: 'client',
    };
    const { ops } = await userCollection.insertOne(userAdd);
    const { _id } = ops[0];
    const token = await jwt.sign({ _id }, variables.Security.secretKey);
    const user = await sut.loadByToken(token, 'client');
    expect(user).toBeTruthy();
    expect(user._id).toBeTruthy();
    expect(user.name).toBe('any_name');
    expect(user.email).toBe('any_email@mail.com');
  });
  test('Should return null user if loadByToken fails', async () => {
    const sut = makeSut();
    const token = await jwt.sign(
      { _id: new ObjectId() },
      variables.Security.secretKey,
    );
    const user = await sut.loadByToken(token, 'client');
    expect(user).toBeFalsy();
  });

  test('Should return an user updated success', async () => {
    const user = await makeUser();
    const sut = makeSut();
    const userUpdated = await sut.updateOne(
      {
        cpf: 'any_cpf',
        phone: 'any_phone',
      },
      user._id,
    );
    expect(userUpdated).toBeTruthy();
    expect(userUpdated._id).toBeTruthy();
    expect(userUpdated.cpf).toBe('any_cpf');
    expect(userUpdated.phone).toBe('any_phone');
  });
  test('Should return an user updated password success', async () => {
    const user = await makeUser();
    const sut = makeSut();
    const userUpdated = await sut.updatePassword('new_password', user._id);
    expect(userUpdated).toBeTruthy();
    expect(userUpdated._id).toBeTruthy();
  });
  test('Should return an user loaded by id with success', async () => {
    const user = await makeUser();
    const sut = makeSut();
    const userLoaded = await sut.loadById(user._id);
    expect(userLoaded).toBeTruthy();
    expect(userLoaded._id).toBeTruthy();
    expect(userLoaded._id).toEqual(user._id);
  });
  test('Should return an user loadByPage success', async () => {
    const sut = makeSut();
    let arrayUsers = makeFakeArrayUsers();
    arrayUsers.forEach((acc) => {
      delete acc._id;
      acc.role = 'owner';
    });
    await userCollection.insertMany(arrayUsers);
    await userCollection.createIndex({ coord: '2dsphere' });
    const userAdded = await makeUser();
    const users = await sut.loadByPage(1, userAdded._id);
    expect(users).toBeTruthy();
    expect(users[0]).toBeTruthy();
    expect(users[1]).toBeTruthy();
    expect(users.length).toBe(10);
  });
  test('Should return an user countUsersByPage success', async () => {
    const sut = makeSut();
    let arrayUsers = makeFakeArrayUsers();
    arrayUsers.forEach((acc) => {
      delete acc._id;
      acc.role = 'owner';
    });
    await userCollection.insertMany(arrayUsers);
    const userAdded = await makeUser();
    const usersCounts = await sut.countUsersByPage(1, userAdded._id);
    expect(usersCounts).toBe(15);
  });
  test('Should return 0 on countUsersByPage success', async () => {
    const sut = makeSut();
    const userAdded = await makeUser();
    const usersCounts = await sut.countUsersByPage(1, userAdded._id);
    expect(usersCounts).toBe(0);
  });
});

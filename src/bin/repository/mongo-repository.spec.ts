import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import MockDate from 'mockdate';
let userCollection: Collection;

describe('Mongo Repository', () => {
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

  const makeSut = (): MongoRepository => {
    return new MongoRepository('users');
  };
  test('Should return an user add success', async () => {
    const sut = makeSut();
    const user = await sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
      role: 'client',
      createdAt: new Date(),
      coord: [43.6589, -67.0087548],
      payDay: new Date(),
    });
    expect(user).toBeTruthy();
    expect(user._id).toBeTruthy();
    expect(user.name).toBe('valid_name');
    expect(user.email).toBe('valid_email@mail.com');
  });

  test('Should return an user getOne success', async () => {
    const sut = makeSut();
    await userCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    const user = await sut.getOne({ email: 'any_email@mail.com' });
    expect(user).toBeTruthy();
    expect(user._id).toBeTruthy();
    expect(user.name).toBe('any_name');
    expect(user.email).toBe('any_email@mail.com');
  });
  test('Should return null user if getOne fails', async () => {
    const sut = makeSut();
    const user = await sut.getOne({ email: 'any_email@mail.com' });
    expect(user).toBeFalsy();
  });
  test('Should return null user if getOne fails', async () => {
    const sut = makeSut();
    const user = await sut.getOne({ email: 'any_email@mail.com' });
    expect(user).toBeFalsy();
  });
});

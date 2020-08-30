import { AccountMongoRepository } from './account-mongo-repository';
import { MongoHelper } from '../../../bin/helpers/db/mongo/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import variables from '../../../bin/configuration/variables';
let accountCollection: Collection;
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  test('Should return an account add success', async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(account).toBeTruthy();
    expect(account._id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@mail.com');
  });

  test('Should return an account loadByEmail success', async () => {
    const sut = makeSut();
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    const account = await sut.loadByEmail('any_email@mail.com');
    expect(account).toBeTruthy();
    expect(account._id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@mail.com');
  });
  test('Should return null account if loadByEmail fails', async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail('any_email@mail.com');
    expect(account).toBeFalsy();
  });
  test('Should return an account loadByToken success without role', async () => {
    const sut = makeSut();
    const userAdd = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const { ops } = await accountCollection.insertOne(userAdd);
    const { _id } = ops[0];
    const token = await jwt.sign({ _id }, variables.Security.secretKey);
    const account = await sut.loadByToken(token);
    expect(account).toBeTruthy();
    expect(account._id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@mail.com');
  });
  test('Should return an account loadByToken success with role', async () => {
    const sut = makeSut();
    const userAdd = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      role: 'any_role',
    };
    const { ops } = await accountCollection.insertOne(userAdd);
    const { _id } = ops[0];
    const token = await jwt.sign({ _id }, variables.Security.secretKey);
    const account = await sut.loadByToken(token, 'any_role');
    expect(account).toBeTruthy();
    expect(account._id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@mail.com');
  });
  test('Should return null account if loadByToken fails', async () => {
    const sut = makeSut();
    const token = await jwt.sign(
      { _id: new ObjectId() },
      variables.Security.secretKey,
    );
    const account = await sut.loadByToken(token);
    expect(account).toBeFalsy();
  });
});

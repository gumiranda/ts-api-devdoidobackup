import { AccountMongoRepository } from './account-mongo-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import variables from '@/bin/configuration/variables';
import {
  mockFakeAccountData,
  makeFakeArrayAccounts,
} from '@/modules/account/models/mocks/mock-account';
import { AccountModel } from '@/modules/account/models/account-model';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import MockDate from 'mockdate';
let accountCollection: Collection;
const makeAccount = async (): Promise<AccountModel> => {
  let account = mockFakeAccountData();
  account.coord = { type: 'Point', coordinates: account.coord };
  const { ops } = await accountCollection.insertOne(account);
  return ops[0];
};
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    const mongoRepository = new MongoRepository('accounts');
    return new AccountMongoRepository(mongoRepository);
  };

  test('Should return an account add success', async () => {
    const sut = makeSut();
    const account = await sut.add(mockFakeAccountData());
    expect(account).toBeTruthy();
    expect(account._id).toBeTruthy();
    expect(account.name).toBe('valid_name');
    expect(account.email).toBe('valid_email@mail.com');
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
  test('Should return an account loadByPage success', async () => {
    const sut = makeSut();
    let arrayAccounts = makeFakeArrayAccounts();
    arrayAccounts.forEach((acc) => {
      delete acc._id;
      acc.role = 'owner';
    });
    await accountCollection.insertMany(arrayAccounts);
    await accountCollection.createIndex({ coord: '2dsphere' });
    const accountAdded = await makeAccount();
    const accounts = await sut.loadByPage(1, accountAdded._id);
    expect(accounts).toBeTruthy();
    expect(accounts[0]).toBeTruthy();
    expect(accounts[1]).toBeTruthy();
    expect(accounts.length).toBe(10);
  });
  test('Should return an account countAccountsByPage success', async () => {
    const sut = makeSut();
    let arrayAccounts = makeFakeArrayAccounts();
    arrayAccounts.forEach((acc) => {
      delete acc._id;
      acc.role = 'owner';
    });
    await accountCollection.insertMany(arrayAccounts);
    const accountAdded = await makeAccount();
    const accountsCounts = await sut.countAccountsByPage(1, accountAdded._id);
    expect(accountsCounts).toBe(15);
  });
  test('Should return null account if loadByEmail fails', async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail('any_email@mail.com');
    expect(account).toBeFalsy();
  });

  test('Should return an account loadByToken success with role', async () => {
    const sut = makeSut();
    const userAdd = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      role: 'client',
    };
    const { ops } = await accountCollection.insertOne(userAdd);
    const { _id } = ops[0];
    const token = await jwt.sign({ _id }, variables.Security.secretKey);
    const account = await sut.loadByToken(token, 'client');
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
    const account = await sut.loadByToken(token, 'client');
    expect(account).toBeFalsy();
  });
  test('Should return an account updated success', async () => {
    const account = await makeAccount();
    const sut = makeSut();
    const accountUpdated = await sut.updateOne(
      {
        cpf: 'any_cpf',
        phone: 'any_phone',
      },
      account._id,
    );
    expect(accountUpdated).toBeTruthy();
    expect(accountUpdated._id).toBeTruthy();
    expect(accountUpdated.cpf).toBe('any_cpf');
    expect(accountUpdated.phone).toBe('any_phone');
  });
  test('Should return an account updated password success', async () => {
    const account = await makeAccount();
    const sut = makeSut();
    const accountUpdated = await sut.updatePassword(
      'new_password',
      account._id,
    );
    expect(accountUpdated).toBeTruthy();
    expect(accountUpdated._id).toBeTruthy();
  });
  test('Should return an account loaded by id with success', async () => {
    const account = await makeAccount();
    const sut = makeSut();
    const accountLoaded = await sut.loadById(account._id);
    expect(accountLoaded).toBeTruthy();
    expect(accountLoaded._id).toBeTruthy();
    expect(accountLoaded._id).toEqual(account._id);
  });
});

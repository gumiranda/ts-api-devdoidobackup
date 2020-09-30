import { RequestMongoRepository } from './request-mongo-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import MockDate from 'mockdate';
import { mockFakeUserData } from '@/modules/user/models/mocks/mock-user';
import { UserModel } from '@/modules/user/models/user-model';
import {
  mockFakeRequestData,
  makeFakeArrayRequests,
} from '../models/mocks/mock-request';
import { RequestModel } from '../models/request-model';

let requestCollection: Collection;
let userCollection: Collection;

const makeRequest = async (): Promise<RequestModel> => {
  let request = mockFakeRequestData();
  const { ops } = await requestCollection.insertOne(request);
  return ops[0];
};
const makeUser = async (): Promise<UserModel> => {
  let user = mockFakeUserData('client');
  user.coord = { type: 'Point', coordinates: user.coord };
  const { ops } = await userCollection.insertOne(user);
  return ops[0];
};
const makeSut = (): RequestMongoRepository => {
  const mongoRepository = new MongoRepository('requests');
  return new RequestMongoRepository(mongoRepository);
};
describe('Request Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    requestCollection = await MongoHelper.getCollection('requests');
    userCollection = await MongoHelper.getCollection('users');
    await requestCollection.deleteMany({});
    await userCollection.deleteMany({});
  });

  test('Should return an request add success', async () => {
    const sut = makeSut();
    const request = await sut.add(mockFakeRequestData());
    expect(request).toBeTruthy();
    expect(request._id).toBeTruthy();
    expect(request.content).toBe('string');
    expect(request.type).toBe('string');
    expect(request.userBy).toBe('string');
  });

  test('Should return an request loaded by id with success', async () => {
    const request = await makeRequest();
    const sut = makeSut();
    const requestLoaded = await sut.loadById(request._id);
    expect(requestLoaded).toBeTruthy();
    expect(requestLoaded._id).toBeTruthy();
    expect(requestLoaded._id).toEqual(request._id);
  });
  test('Should return an request loadByPage success', async () => {
    const sut = makeSut();
    const user = await makeUser();
    let arrayRequests = makeFakeArrayRequests();
    arrayRequests.forEach((acc) => {
      delete acc._id;
      acc.userFor = user._id;
    });
    await requestCollection.insertMany(arrayRequests);
    const requests = await sut.loadByPage(1, user._id);
    expect(requests).toBeTruthy();
    expect(requests[0]).toBeTruthy();
    expect(requests[1]).toBeTruthy();
    expect(requests.length).toBe(10);
  });
  test('Should return an request countRequestsByPage success', async () => {
    const sut = makeSut();
    let arrayRequests = makeFakeArrayRequests();
    const user = await makeUser();
    arrayRequests.forEach((acc) => {
      delete acc._id;
      acc.userFor = user._id;
    });
    await requestCollection.insertMany(arrayRequests);
    const requestsCounts = await sut.countRequestsByPage(user._id);
    expect(requestsCounts).toBe(15);
  });
  test('Should return 0 on countRequestsByPage success', async () => {
    const sut = makeSut();
    const user = await makeUser();
    const requestsCounts = await sut.countRequestsByPage(user._id);
    expect(requestsCounts).toBe(0);
  });
  test('Should return an request updated success', async () => {
    const request = await makeRequest();
    const sut = makeSut();
    const requestUpdated = await sut.updateOne(
      {
        read: true,
      },
      request._id,
    );
    expect(requestUpdated).toBeTruthy();
    expect(requestUpdated._id).toBeTruthy();
    expect(requestUpdated.read).toBe(true);
  });
});

import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection, ObjectId } from 'mongodb';
import { hash } from 'bcrypt';
import variables from '@/bin/configuration/variables';
import { sign } from 'jsonwebtoken';
import { addDay } from '@/bin/utils/date-fns';
import { mockFakeRequestRequest } from '../models/mocks/mock-request';
let userCollection: Collection;
let requestCollection: Collection;
const makeAccessToken = async (
  role: string,
  password: string,
): Promise<any> => {
  const res = await userCollection.insertOne({
    name: 'tedsste',
    email: 'testando@gmail.com',
    payDay: addDay(new Date(), 30),
    password,
    role,
  });
  const _id = res.ops[0]._id;
  return { _id, token: sign({ _id }, variables.Security.secretKey) };
};

describe('Name of the group', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    userCollection = await MongoHelper.getCollection('users');
    requestCollection = await MongoHelper.getCollection('requests');
    await userCollection.deleteMany({});
    await requestCollection.deleteMany({});
  });

  describe('GET /request/:page', () => {
    test('Should return 200 an request list on success', async () => {
      const password = await hash('111123', 12);
      const { token, _id } = await makeAccessToken('owner', password);
      const userReceiver = await makeAccessToken('owner', password);
      await requestCollection.insertMany([
        {
          content: 'string',
          type: 'string',
          userBy: new ObjectId(userReceiver._id),
          userFor: new ObjectId(_id),
          read: false,
          createdAt: new Date(),
        },
      ]);
      await request(app)
        .get('/api/request/1')
        .set('authorization', 'Bearer ' + token)
        .expect(200);
    });
    test('Should return 200 an request list empty', async () => {
      const password = await hash('111123', 12);
      const { token } = await makeAccessToken('owner', password);
      await request(app)
        .get('/api/request/1')
        .set('authorization', 'Bearer ' + token)
        .expect(200);
    });
    test('Should return 403 without token on request list', async () => {
      await request(app).get('/api/request/1').expect(403);
    });
  });
  describe('UPDATE /request/:requestId', () => {
    test('Should return 202 an request updated on success', async () => {
      const password = await hash('111123', 12);
      const { token, _id } = await makeAccessToken('owner', password);
      const userReceiver = await makeAccessToken('professional', password);
      const requestCreated = await requestCollection.insertOne({
        content: 'string',
        type: 'string',
        userBy: new ObjectId(userReceiver._id),
        userFor: new ObjectId(_id),
        read: true,
        createdAt: new Date(),
      });
      await request(app)
        .put(`/api/request/${requestCreated.ops[0]._id}`)
        .send({ read: true })
        .set('authorization', 'Bearer ' + token)
        .expect(202);
    });

    test('Should return 403 without token on request id', async () => {
      await request(app).put('/api/request/anyrequestid').expect(403);
    });
  });
  describe('POST /request', () => {
    test('Should return 201 an request on success', async () => {
      const password = await hash('111123', 12);
      const { token } = await makeAccessToken('owner', password);
      const userReceiver = await makeAccessToken('owner', password);
      await request(app)
        .post(`/api/request`)
        .send(mockFakeRequestRequest(userReceiver._id))
        .set('authorization', 'Bearer ' + token)
        .expect(201);
    });

    test('Should return 403 without token on request id', async () => {
      await request(app)
        .post('/api/request')
        .send(mockFakeRequestRequest('any_id'))
        .expect(403);
    });
  });
});

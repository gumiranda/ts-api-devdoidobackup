import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import variables from '@/bin/configuration/variables';
import { sign } from 'jsonwebtoken';
import { mockFakeTransactionRequest } from '../models/mocks/mock-transaction';
import { addDay } from '@/bin/utils/date-fns';
let userCollection: Collection;
const makeAccessToken = async (
  role: string,
  password: string,
): Promise<string> => {
  const res = await userCollection.insertOne({
    name: 'tedsste',
    email: 'testando@gmail.com',
    password,
    payDay: addDay(new Date(), 30),
    role,
  });
  const _id = res.ops[0]._id;
  return sign({ _id }, variables.Security.secretKey);
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
    await userCollection.deleteMany({});
  });

  describe('POST /', () => {
    test('Should return 200 an transaction on success', async () => {
      const password = await hash('111123', 12);
      const accessToken = await makeAccessToken('owner', password);
      await request(app)
        .post('/api/transaction')
        .send(mockFakeTransactionRequest())
        .set('authorization', 'Bearer ' + accessToken)
        .expect(200);
    });
    test('Should return 403 with role client on transaction', async () => {
      const password = await hash('111123', 12);
      const accessToken = await makeAccessToken('client', password);
      await request(app)
        .post('/api/transaction')
        .send(mockFakeTransactionRequest())
        .set('authorization', 'Bearer ' + accessToken)
        .expect(403);
    });
    test('Should return 403 without token role client on transaction', async () => {
      await request(app)
        .post('/api/transaction')
        .send(mockFakeTransactionRequest())
        .expect(403);
    });
  });
});

import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import variables from '@/bin/configuration/variables';
import { sign } from 'jsonwebtoken';
let accountCollection: Collection;
const makeAccessToken = async (role: string): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'tedsste',
    email: 'testando@gmail.com',
    password: '222',
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
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    test('Should return 200 an account on success', async () => {
      await request(app)
        .post('/api/user/register')
        .send({
          name: 'tedsste',
          email: 'testetessaste@gmail.com',
          password: '111123',
          passwordConfirmation: '111123',
        })
        .expect(200);
    });
  });

  describe('POST /user/authenticate', () => {
    test('Should return 200 an token on login', async () => {
      const password = await hash('111123', 12);
      await accountCollection.insertOne({
        name: 'tedsste',
        email: 'testando@gmail.com',
        password,
      });
      await request(app)
        .post('/api/user/authenticate')
        .send({
          email: 'testando@gmail.com',
          password: '111123',
        })
        .expect(200);
    });
    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/user/authenticate')
        .send({
          email: 'testando@gmail.com',
          password: '111123',
        })
        .expect(401);
    });
  });
  describe('GET /user/page/:page', () => {
    test('Should return 200 an token on users', async () => {
      const accessToken = await makeAccessToken('client');
      const password = await hash('111123', 12);
      await accountCollection.insertMany([
        {
          name: 'tedsste',
          email: 'testando@gmail.com',
          password,
        },
        {
          name: 'tedsste',
          email: 'testando@gmail.com',
          password,
        },
      ]);
      await request(app)
        .get('/api/user/page/1')
        .set('authorization', 'Bearer ' + accessToken);
      expect(200);
    });
    test('Should return 401 an token without role client on users', async () => {
      const accessToken = await makeAccessToken('any_role');
      const password = await hash('111123', 12);
      await accountCollection.insertMany([
        {
          name: 'tedsste',
          email: 'testando@gmail.com',
          password,
        },
        {
          name: 'tedsste',
          email: 'testando@gmail.com',
          password,
        },
      ]);
      await request(app)
        .get('/api/user/page/1')
        .set('authorization', 'Bearer ' + accessToken);
      expect(401);
    });
    test('Should return 403 on users without token', async () => {
      await request(app).get('/api/user/page/1').expect(403);
    });
  });
});

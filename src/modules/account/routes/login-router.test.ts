import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
let accountCollection: Collection;
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
        .post('/api/account/signup')
        .send({
          name: 'tedsste',
          email: 'testetessaste@gmail.com',
          password: '111123',
          passwordConfirmation: '111123',
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    test('Should return 200 an token on login', async () => {
      const password = await hash('111123', 12);
      await accountCollection.insertOne({
        name: 'tedsste',
        email: 'testando@gmail.com',
        password,
      });
      await request(app)
        .post('/api/account/login')
        .send({
          email: 'testando@gmail.com',
          password: '111123',
        })
        .expect(200);
    });
    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/account/login')
        .send({
          email: 'testando@gmail.com',
          password: '111123',
        })
        .expect(401);
    });
  });
});

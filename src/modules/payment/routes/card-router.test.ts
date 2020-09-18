import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import variables from '@/bin/configuration/variables';
import { sign } from 'jsonwebtoken';
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

  describe('POST /user/register', () => {
    test('Should return 200 an user on success', async () => {
      await request(app)
        .post('/api/user/register')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: '111123',
          passwordConfirmation: '111123',
          role: 'client',
          coord: [25.0000188, -71.0087548],
          pushToken: 'any_token',
          payDay: addDay(new Date(), 7),
        })
        .expect(200);
    });
  });

  describe('POST /user/authenticate', () => {
    test('Should return 200 an token on login', async () => {
      const password = await hash('111123', 12);
      await userCollection.insertOne({
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
      const password = await hash('111123', 12);
      const accessToken = await makeAccessToken('client', password);
      await userCollection.insertMany([
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
      const password = await hash('111123', 12);
      const accessToken = await makeAccessToken('client', password);
      await userCollection.insertMany([
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
  describe('PUT /user/completeRegister', () => {
    test('Should return 200 an update on my user', async () => {
      const password = await hash('111123', 12);
      const accessToken = await makeAccessToken('client', password);
      await request(app)
        .put('/api/user/completeRegister')
        .send({
          cpf: 'any_cpf',
          phone: 'any_phone',
        })
        .set('authorization', 'Bearer ' + accessToken);
      expect(200);
    });
    test('Should return 401 an token without role client on users', async () => {
      const password = await hash('111123', 12);
      const accessToken = await makeAccessToken('any_role', password);
      await request(app)
        .put('/api/user/completeRegister')
        .send({
          cpf: 'any_cpf',
          phone: 'any_phone',
        })
        .set('authorization', 'Bearer ' + accessToken);
      expect(401);
    });
    test('Should return 403 on users without token', async () => {
      await request(app)
        .put('/api/user/completeRegister')
        .send({
          cpf: 'any_cpf',
          phone: 'any_phone',
        })
        .expect(403);
    });
  });
  describe('PUT /user/updatePassword', () => {
    test('Should return 200 an update on my user', async () => {
      const password = await hash('111123', 12);
      const accessToken = await makeAccessToken('client', password);
      await request(app)
        .put('/api/user/updatePassword')
        .send({
          oldPassword: '111123',
          newPassword: 'any_password',
        })
        .set('authorization', 'Bearer ' + accessToken);
      expect(200);
    });
    test('Should return 401 an token without role client on users', async () => {
      const password = await hash('111123', 12);
      const accessToken = await makeAccessToken('client', password);
      await userCollection.insertMany([
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
        .put('/api/user/updatePassword')
        .send({
          oldPassword: '111123',
          newPassword: 'any_password',
        })
        .set('authorization', 'Bearer ' + accessToken);
      expect(401);
    });
    test('Should return 403 on users without token', async () => {
      await request(app)
        .put('/api/user/updatePassword')
        .send({
          oldPassword: '111123',
          newPassword: 'any_password',
        })
        .expect(403);
    });
  });
});

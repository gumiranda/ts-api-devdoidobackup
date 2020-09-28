import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection, ObjectId } from 'mongodb';
import { hash } from 'bcrypt';
import variables from '@/bin/configuration/variables';
import { sign } from 'jsonwebtoken';
import { addDay } from '@/bin/utils/date-fns';
import { mockFakeNotificationRequest } from '../models/mocks/mock-notification';
let userCollection: Collection;
let notificationCollection: Collection;
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
    notificationCollection = await MongoHelper.getCollection('notifications');
    await userCollection.deleteMany({});
    await notificationCollection.deleteMany({});
  });

  describe('GET /notification/:page', () => {
    test('Should return 200 an notification list on success', async () => {
      const password = await hash('111123', 12);
      const { token, _id } = await makeAccessToken('owner', password);
      const userReceiver = await makeAccessToken('owner', password);
      await notificationCollection.insertMany([
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
        .get('/api/notification/1')
        .set('authorization', 'Bearer ' + token)
        .expect(200);
    });
    test('Should return 200 an notification list empty', async () => {
      const password = await hash('111123', 12);
      const { token } = await makeAccessToken('owner', password);
      await request(app)
        .get('/api/notification/1')
        .set('authorization', 'Bearer ' + token)
        .expect(200);
    });
    test('Should return 403 without token on notification list', async () => {
      await request(app).get('/api/notification/1').expect(403);
    });
  });
  describe('UPDATE /notification/:notificationId', () => {
    test('Should return 202 an notification updated on success', async () => {
      const password = await hash('111123', 12);
      const { token, _id } = await makeAccessToken('owner', password);
      const userReceiver = await makeAccessToken('owner', password);
      const notification = await notificationCollection.insertOne({
        content: 'string',
        type: 'string',
        userBy: new ObjectId(userReceiver._id),
        userFor: new ObjectId(_id),
        read: false,
        createdAt: new Date(),
      });
      await request(app)
        .put(`/api/notification/${notification.ops[0]._id}`)
        .send({ read: true })
        .set('authorization', 'Bearer ' + token)
        .expect(202);
    });

    test('Should return 403 without token on notification id', async () => {
      await request(app).put('/api/notification/anynotificationid').expect(403);
    });
  });
  describe('POST /notification', () => {
    test('Should return 200 an notification on success', async () => {
      const password = await hash('111123', 12);
      const { token } = await makeAccessToken('owner', password);
      const userReceiver = await makeAccessToken('owner', password);
      await request(app)
        .post(`/api/notification`)
        .send(mockFakeNotificationRequest(userReceiver._id))
        .set('authorization', 'Bearer ' + token)
        .expect(200);
    });

    test('Should return 403 without token on notification id', async () => {
      await request(app)
        .post('/api/notification')
        .send(mockFakeNotificationRequest('any_id'))
        .expect(403);
    });
  });
});

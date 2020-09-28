import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection, ObjectId } from 'mongodb';
import { hash } from 'bcrypt';
import variables from '@/bin/configuration/variables';
import { sign } from 'jsonwebtoken';
import { addDay } from '@/bin/utils/date-fns';
import { mockFakeChatRequest } from '../models/mocks/mock-chat';
let userCollection: Collection;
let chatCollection: Collection;
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
    chatCollection = await MongoHelper.getCollection('chats');
    await userCollection.deleteMany({});
    await chatCollection.deleteMany({});
  });

  describe('GET /chat/:page', () => {
    test('Should return 200 an chat list on success', async () => {
      const password = await hash('111123', 12);
      const { token, _id } = await makeAccessToken('owner', password);
      const userReceiver = await makeAccessToken('owner', password);
      await chatCollection.insertMany([
        {
          countMessages: 0,
          userBy: new ObjectId(userReceiver._id),
          userFor: new ObjectId(_id),
          lastMessage: '',
          createdAt: new Date(),
        },
      ]);
      await request(app)
        .get('/api/chat/1')
        .set('authorization', 'Bearer ' + token)
        .expect(200);
    });
    test('Should return 200 an chat list empty', async () => {
      const password = await hash('111123', 12);
      const { token } = await makeAccessToken('owner', password);
      await request(app)
        .get('/api/chat/1')
        .set('authorization', 'Bearer ' + token)
        .expect(200);
    });
    test('Should return 403 without token on chat list', async () => {
      await request(app).get('/api/chat/1').expect(403);
    });
  });
  describe('UPDATE /chat/:chatId', () => {
    test('Should return 202 an chat updated on success', async () => {
      const password = await hash('111123', 12);
      const { token, _id } = await makeAccessToken('owner', password);
      const userReceiver = await makeAccessToken('owner', password);
      const chat = await chatCollection.insertOne({
        countMessages: 0,
        userBy: new ObjectId(userReceiver._id),
        userFor: new ObjectId(_id),
        lastMessage: '',
        createdAt: new Date(),
      });
      await request(app)
        .put(`/api/chat/${chat.ops[0]._id}`)
        .send({ message: { text: 'oi' } })
        .set('authorization', 'Bearer ' + token)
        .expect(202);
    });
    test('Should return 403 without token on chat id', async () => {
      await request(app).put('/api/chat/anychatid').expect(403);
    });
  });
  describe('POST /chat', () => {
    test('Should return 201 an chat on success', async () => {
      const password = await hash('111123', 12);
      const { token } = await makeAccessToken('owner', password);
      const userReceiver = await makeAccessToken('owner', password);
      await request(app)
        .post(`/api/chat`)
        .send(mockFakeChatRequest(userReceiver._id))
        .set('authorization', 'Bearer ' + token)
        .expect(201);
    });

    test('Should return 403 without token on chat id', async () => {
      await request(app)
        .post('/api/chat')
        .send(mockFakeChatRequest('any_id'))
        .expect(403);
    });
  });
});

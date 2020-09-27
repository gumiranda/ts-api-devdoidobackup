import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection, ObjectId } from 'mongodb';
import { hash } from 'bcrypt';
import variables from '@/bin/configuration/variables';
import { sign } from 'jsonwebtoken';
import { mockFakeTransactionRequest } from '../models/mocks/mock-transaction';
import { addDay } from '@/bin/utils/date-fns';
let userCollection: Collection;
let cardCollection: Collection;
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
    cardCollection = await MongoHelper.getCollection('cards');
    await userCollection.deleteMany({});
    await cardCollection.deleteMany({});
  });

  describe('GET /card/:page', () => {
    test('Should return 200 an card list on success', async () => {
      const password = await hash('111123', 12);
      const { token, _id } = await makeAccessToken('owner', password);
      await cardCollection.insertMany([
        {
          card_id: 'string',
          cardNumber: 'string',
          holder_name: 'string',
          name: 'string',
          brand: 'string',
          street: 'string',
          street_number: 'string',
          neighborhood: 'string',
          city: 'string',
          state: 'string',
          zipcode: 'string',
          phone: 'string',
          cpf: 'string',
          email: 'string',
          userId: new ObjectId(_id),
          active: true,
          createdAt: new Date(),
        },
      ]);
      await request(app)
        .get('/api/card/1')
        .set('authorization', 'Bearer ' + token)
        .expect(200);
    });
    test('Should return 403 with role client on card list', async () => {
      const password = await hash('111123', 12);
      const { token } = await makeAccessToken('client', password);
      await request(app)
        .get('/api/card/1')
        .set('authorization', 'Bearer ' + token)
        .expect(403);
    });
    test('Should return 403 without token role client on card list', async () => {
      await request(app).get('/api/card/1').expect(403);
    });
  });
  describe('DELETE /card/:cardId', () => {
    test('Should return 200 an card list on success', async () => {
      const password = await hash('111123', 12);
      const { token, _id } = await makeAccessToken('owner', password);
      await cardCollection.insertMany([
        {
          card_id: 'anycardid',
          cardNumber: 'string',
          holder_name: 'string',
          name: 'string',
          brand: 'string',
          street: 'string',
          street_number: 'string',
          neighborhood: 'string',
          city: 'string',
          state: 'string',
          zipcode: 'string',
          phone: 'string',
          cpf: 'string',
          email: 'string',
          userId: new ObjectId(_id),
          active: true,
          createdAt: new Date(),
        },
      ]);
      await request(app)
        .delete('/api/card/anycardid')
        .set('authorization', 'Bearer ' + token)
        .expect(200);
    });
    test('Should return 403 with role client on card list', async () => {
      const password = await hash('111123', 12);
      const { token } = await makeAccessToken('client', password);
      await request(app)
        .delete('/api/card/anycardid')
        .set('authorization', 'Bearer ' + token)
        .expect(403);
    });
    test('Should return 403 without token role owner on card id', async () => {
      await request(app).delete('/api/card/anycardid').expect(403);
    });
  });
});

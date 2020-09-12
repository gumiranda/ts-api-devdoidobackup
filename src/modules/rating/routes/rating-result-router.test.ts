import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import variables from '@/bin/configuration/variables';
import { mockFakeAddRating } from '@/modules/rating/models/mocks/mock-rating';
let userCollection: Collection;
let ratingCollection: Collection;

const makeInsertRating = async (): Promise<string> => {
  const res = await ratingCollection.insertOne(mockFakeAddRating());
  const _id = res.ops[0]._id;
  return _id.toString();
};
const makeAccessToken = async (): Promise<string> => {
  const res = await userCollection.insertOne({
    name: 'tedsste',
    email: 'testando@gmail.com',
    password: '222',
    role: 'admin',
  });
  const _id = res.ops[0]._id;
  return sign({ _id }, variables.Security.secretKey);
};
const makeOwner = async (): Promise<string> => {
  const res = await userCollection.insertOne({
    name: 'tedsste',
    email: 'owner@gmail.com',
    password: '222',
    role: 'owner',
  });
  return res.ops[0]._id;
};
describe('/ratingResult', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    ratingCollection = await MongoHelper.getCollection('ratings');
    await ratingCollection.deleteMany({});
    userCollection = await MongoHelper.getCollection('users');
    await userCollection.deleteMany({});
  });
  describe('PUT /:ratingId/results', () => {
    test('Should return 403 an rating result without accessToken', async () => {
      await request(app)
        .put('/api/ratingResult/any_id/any_id/results')
        .send({
          ratingType: 'atendimento',
        })
        .expect(403);
    });
    test('Should return 200 an rating result with accessToken', async () => {
      const accessToken = await makeAccessToken();
      const owner = await makeOwner();
      const ratingId = await makeInsertRating();
      await request(app)
        .put(`/api/ratingResult/${ratingId}/${owner}/results`)
        .send({
          rating: 'Bom',
        })
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200);
    });
  });
  describe('GET /:ratingId/results', () => {
    test('Should return 403 an load rating result without accessToken', async () => {
      await request(app)
        .get('/api/ratingResult/any_id/any_id/results')
        .send({
          ratingType: 'atendimento',
        })
        .expect(403);
    });
    test('Should return 200 an load rating result with accessToken', async () => {
      const accessToken = await makeAccessToken();
      const owner = await makeOwner();
      const ratingId = await makeInsertRating();
      await request(app)
        .get(`/api/ratingResult/${ratingId}/${owner}/results`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200);
    });
  });
});

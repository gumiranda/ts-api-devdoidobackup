import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import variables from '@/bin/configuration/variables';
import { mockFakeRatings } from '@/modules/rating/models/mocks/mock-rating';
let userCollection: Collection;
let ratingCollection: Collection;
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

describe('POST /', () => {
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

  test('Should return 403 an rating without accessToken', async () => {
    await request(app)
      .post('/api/rating')
      .send({
        ratingType: 'atendimento',
        ratings: [{ stars: 2, rating: 'any_rating' }],
      })
      .expect(403);
  });
  test('Should return 200 an rating with valid accessToken', async () => {
    const accessToken = await makeAccessToken();
    await request(app)
      .post('/api/rating')
      .send({
        ratingType: 'atendimento',
        ratings: [{ stars: 2, rating: 'any_rating' }],
      })
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(204);
  });

  describe('GET /', () => {
    test('Should return 403 an rating without accessToken', async () => {
      await request(app).get('/api/rating').expect(403);
    });
    test('Should return 200 an rating with accessToken', async () => {
      await ratingCollection.insertMany(mockFakeRatings());
      const accessToken = await makeAccessToken();
      await request(app)
        .get('/api/rating')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200);
    });
    test('Should return 204 an rating empty list with accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .get('/api/rating')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(204);
    });
  });
});

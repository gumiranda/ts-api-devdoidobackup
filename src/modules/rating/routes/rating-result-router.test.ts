import request from 'supertest';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { app } from '@/bin/configuration/app';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import variables from '@/bin/configuration/variables';
import { makeFakeAddRating } from '@/bin/test/mock-rating';
let accountCollection: Collection;
let ratingCollection: Collection;

const makeInsertRating = async (): Promise<string> => {
  const res = await ratingCollection.insertOne(makeFakeAddRating());
  const _id = res.ops[0]._id;
  return _id.toString();
};
const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'tedsste',
    email: 'testando@gmail.com',
    password: '222',
    role: 'admin',
  });
  const _id = res.ops[0]._id;
  return sign({ _id }, variables.Security.secretKey);
};
describe('PUT /:ratingId/results', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    ratingCollection = await MongoHelper.getCollection('ratings');
    await ratingCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  test('Should return 403 an rating result without accessToken', async () => {
    await request(app)
      .put('/api/ratingResult/any_id/results')
      .send({
        result: 'result2',
      })
      .expect(403);
  });
  test('Should return 200 an rating result with accessToken', async () => {
    const accessToken = await makeAccessToken();
    const ratingId = await makeInsertRating();
    await request(app)
      .put(`/api/ratingResult/${ratingId}/results`)
      .send({
        result: 'result2',
      })
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);
  });
});

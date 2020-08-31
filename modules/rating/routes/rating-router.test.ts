import request from 'supertest';
import { MongoHelper } from '../../../bin/helpers/db/mongo/mongo-helper';
import { app } from '../../../bin/configuration/app';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import variables from '../../../bin/configuration/variables';
let accountCollection: Collection;
let ratingCollection: Collection;
describe('POST /add', () => {
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

  test('Should return 403 an rating without accessToken', async () => {
    await request(app)
      .post('/api/rating/add')
      .send({
        ratingFor: 'any_entity',
        ratings: [
          { ratingType: 'any_ratingtype', obs: 'any_rating', stars: 3 },
        ],
      })
      .expect(403);
  });
  test('Should return 200 an rating with valid accessToken', async () => {
    const res = await accountCollection.insertOne({
      name: 'tedsste',
      email: 'testando@gmail.com',
      password: '222',
      role: 'admin',
    });
    const _id = res.ops[0]._id;
    const accessToken = sign({ _id }, variables.Security.secretKey);
    await request(app)
      .post('/api/rating/add')
      .send({
        ratingFor: 'any_entity',
        //date: new Date(),
        ratings: [
          { ratingType: 'any_ratingtype', obs: 'any_rating', stars: 3 },
        ],
      })
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(204);
  });
});

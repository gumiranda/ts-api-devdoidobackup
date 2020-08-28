import request from 'supertest';
import { MongoHelper } from '../../../bin/helpers/db/mongo/mongo-helper';
import { app } from '../../../bin/configuration/app';
import { Collection } from 'mongodb';
let accountCollection: Collection;
describe('POST /add', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('ratings');
    await accountCollection.deleteMany({});
  });

  test('Should return 200 an rating on success', async () => {
    await request(app)
      .post('/api/rating/add')
      .send({
        ratingFor: 'any_entity',
        ratings: [
          { ratingType: 'any_ratingtype', obs: 'any_rating', stars: 3 },
        ],
      })
      .expect(204);
  });
});

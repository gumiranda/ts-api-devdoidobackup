import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should reconnect if mongodb is down', async () => {
    let userCollection = await MongoHelper.getCollection('users');
    expect(userCollection).toBeTruthy();
    await MongoHelper.disconnect();
    userCollection = await MongoHelper.getCollection('users');
    expect(userCollection).toBeTruthy();
  });
});

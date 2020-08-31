import { MongoHelper  } from './mongo-helper';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await MongoHelper.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
    await MongoHelper.disconnect();
    accountCollection = await MongoHelper.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });
});

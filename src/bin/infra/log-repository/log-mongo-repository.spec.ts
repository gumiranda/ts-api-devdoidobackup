import { Collection } from 'mongodb';
import { LogMongoRepository } from '@/bin/infra/log-repository/log-mongo-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository();
};
describe('Log Mongo Repository', () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  test('Should create an error log on success', async () => {
    const sut = makeSut();
    await sut.logError('any_error');
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});

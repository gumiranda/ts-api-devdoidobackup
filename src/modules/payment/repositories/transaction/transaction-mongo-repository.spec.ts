import { TransactionMongoRepository } from './transaction-mongo-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import MockDate from 'mockdate';
import { mockFakeTransactionData } from '../../models/mocks/mock-transaction';

let transactionCollection: Collection;

const makeSut = (): TransactionMongoRepository => {
  const mongoRepository = new MongoRepository('transactions');
  return new TransactionMongoRepository(mongoRepository);
};
describe('Transaction Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    transactionCollection = await MongoHelper.getCollection('transactions');
    await transactionCollection.deleteMany({});
  });

  test('Should return an transaction add success', async () => {
    const sut = makeSut();
    const transaction = await sut.add(mockFakeTransactionData());
    expect(transaction).toBeTruthy();
    expect(transaction._id).toBeTruthy();
    expect(transaction.cardId).toBe('string');
    expect(transaction.transaction_id).toBe('string');
  });
});

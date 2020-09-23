import { MongoRepository } from '@/bin/repository/mongo-repository';
import { CardMongoRepository } from '@/modules/payment/repositories/card/card-mongo-repository';
import { TransactionMongoRepository } from '@/modules/payment/repositories/transaction/transaction-mongo-repository';
import { DbPayOnce } from '@/modules/payment/usecases/pay-once/db/db-pay-once';
import { PayOnce } from '@/modules/payment/usecases/pay-once/pay-once';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
export const makeDbPayOnce = (): PayOnce => {
  const mongoRepositoryCard = new MongoRepository('cards');
  const mongoRepositoryTransaction = new MongoRepository('transaction');
  const mongoRepositoryUser = new MongoRepository('users');
  const cardMongoRepository = new CardMongoRepository(mongoRepositoryCard);
  const transactionMongoRepository = new TransactionMongoRepository(
    mongoRepositoryTransaction,
  );
  const userMongoRepository = new UserMongoRepository(mongoRepositoryUser);
  return new DbPayOnce(
    transactionMongoRepository,
    cardMongoRepository,
    userMongoRepository,
  );
};

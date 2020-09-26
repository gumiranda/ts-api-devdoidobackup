import { MongoRepository } from '@/bin/repository/mongo-repository';
import { CardMongoRepository } from '@/modules/payment/repositories/card/card-mongo-repository';
import { TransactionMongoRepository } from '@/modules/payment/repositories/transaction/transaction-mongo-repository';
import { DbPayAgain } from '@/modules/payment/usecases/pay-again/db/db-pay-again';
import { PayAgain } from '@/modules/payment/usecases/pay-again/pay-again';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
export const makeDbPayAgain = (): PayAgain => {
  const mongoRepositoryCard = new MongoRepository('cards');
  const mongoRepositoryTransaction = new MongoRepository('transaction');
  const mongoRepositoryUser = new MongoRepository('users');
  const cardMongoRepository = new CardMongoRepository(mongoRepositoryCard);
  const transactionMongoRepository = new TransactionMongoRepository(
    mongoRepositoryTransaction,
  );
  const userMongoRepository = new UserMongoRepository(mongoRepositoryUser);
  return new DbPayAgain(
    transactionMongoRepository,
    cardMongoRepository,
    userMongoRepository,
    userMongoRepository,
  );
};

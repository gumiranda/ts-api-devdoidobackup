import { MongoRepository } from '@/bin/repository/mongo-repository';
import { CardMongoRepository } from '@/modules/payment/repositories/card/card-mongo-repository';
import { TransactionMongoRepository } from '@/modules/payment/repositories/transaction/transaction-mongo-repository';
import { DbPayOnce } from '@/modules/payment/usecases/pay-once/db/db-pay-once';
import { PayOnce } from '@/modules/payment/usecases/pay-once/pay-once';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
import { makeDbUpdatePayDay } from '../update-pay-day/db-update-pay-day-factory';
export const makeDbPayOnce = (): PayOnce => {
  const mongoRepositoryCard = new MongoRepository('cards');
  const mongoRepositoryTransaction = new MongoRepository('transaction');
  const cardMongoRepository = new CardMongoRepository(mongoRepositoryCard);
  const transactionMongoRepository = new TransactionMongoRepository(
    mongoRepositoryTransaction,
  );
  return new DbPayOnce(
    transactionMongoRepository,
    cardMongoRepository,
    makeDbUpdatePayDay(),
  );
};

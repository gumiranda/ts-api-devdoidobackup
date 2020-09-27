import { MongoRepository } from '@/bin/repository/mongo-repository';
import { CardMongoRepository } from '@/modules/payment/repositories/card/card-mongo-repository';
import { TransactionMongoRepository } from '@/modules/payment/repositories/transaction/transaction-mongo-repository';
import { DbPayAgain } from '@/modules/payment/usecases/pay-again/db/db-pay-again';
import { PayAgain } from '@/modules/payment/usecases/pay-again/pay-again';
import { makeDbUpdatePayDay } from '../update-pay-day/db-update-pay-day-factory';
export const makeDbPayAgain = (): PayAgain => {
  const mongoRepositoryCard = new MongoRepository('cards');
  const mongoRepositoryTransaction = new MongoRepository('transaction');
  const cardMongoRepository = new CardMongoRepository(mongoRepositoryCard);
  const transactionMongoRepository = new TransactionMongoRepository(
    mongoRepositoryTransaction,
  );
  return new DbPayAgain(
    transactionMongoRepository,
    cardMongoRepository,
    cardMongoRepository,
    makeDbUpdatePayDay(),
  );
};

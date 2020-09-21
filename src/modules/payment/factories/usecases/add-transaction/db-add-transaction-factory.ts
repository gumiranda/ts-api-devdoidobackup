import { BcryptAdapter } from '@/bin/infra/cryptography/bcrypt-adapter/bcrypt-adapter';

import { MongoRepository } from '@/bin/repository/mongo-repository';
import { TransactionMongoRepository } from '@/modules/payment/repositories/transaction/transaction-mongo-repository';
import { AddTransaction } from '@/modules/payment/usecases/add-transaction/add-transaction';
import { DbAddTransaction } from '@/modules/payment/usecases/add-transaction/db/db-add-transaction';
export const makeDbAddTransaction = (): AddTransaction => {
  const mongoRepository = new MongoRepository('transactions');
  const transactionMongoRepository = new TransactionMongoRepository(
    mongoRepository,
  );
  return new DbAddTransaction(transactionMongoRepository);
};

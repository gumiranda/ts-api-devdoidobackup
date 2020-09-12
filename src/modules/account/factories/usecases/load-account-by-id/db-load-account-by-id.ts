import { MongoRepository } from '@/bin/repository/mongo-repository';
import { AccountMongoRepository } from '@/modules/account/repositories/account-mongo-repository';
import { DbLoadAccountById } from '@/modules/account/usecases/load-account-by-id/db/db-load-account-by-id';
import { LoadAccountById } from '@/modules/account/usecases/load-account-by-id/load-account-by-id';

export const makeDbLoadAccountById = (): LoadAccountById => {
  const mongoRepository = new MongoRepository('accounts');
  const accountMongoRepository = new AccountMongoRepository(mongoRepository);
  return new DbLoadAccountById(accountMongoRepository);
};

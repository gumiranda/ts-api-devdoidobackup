import { AccountMongoRepository } from '@/modules/account/repositories/account-mongo-repository';
import { DbLoadAccountByPage } from '@/modules/account/usecases/load-account-by-page/db/db-load-account-by-page';
import { LoadAccountByPage } from '@/modules/account/usecases/load-account-by-page/load-account-by-page';
import { MongoRepository } from '@/bin/repository/mongo-repository';

export const makeDbLoadAccountByPage = (): LoadAccountByPage => {
  const mongoRepository = new MongoRepository('accounts');
  const accountMongoRepository = new AccountMongoRepository(mongoRepository);
  return new DbLoadAccountByPage(accountMongoRepository);
};

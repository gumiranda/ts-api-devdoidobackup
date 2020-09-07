import { UpdateAccount } from '@/modules/account/usecases/update-account/update-account';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import { AccountMongoRepository } from '@/modules/account/repositories/account-mongo-repository';
import { DbUpdateAccount } from '@/modules/account/usecases/update-account/db/db-update-account';

export const makeDbUpdateAccount = (): UpdateAccount => {
  const mongoRepository = new MongoRepository('accounts');
  const accountMongoRepository = new AccountMongoRepository(mongoRepository);
  return new DbUpdateAccount(accountMongoRepository);
};

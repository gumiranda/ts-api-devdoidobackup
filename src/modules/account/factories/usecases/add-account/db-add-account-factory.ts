import { BcryptAdapter } from '@/bin/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '@/modules/account/repositories/account-mongo-repository';
import { DbAddAccount } from '@/modules/account/usecases/add-account/db/db-add-account';
import { AddAccount } from '@/modules/account/usecases/add-account/add-account';
import { MongoRepository } from '@/bin/repository/mongo-repository';
export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const mongoRepository = new MongoRepository('accounts');
  const accountMongoRepository = new AccountMongoRepository(mongoRepository);
  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository,
  );
};

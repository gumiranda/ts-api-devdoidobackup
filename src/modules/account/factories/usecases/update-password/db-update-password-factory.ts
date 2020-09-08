import { MongoRepository } from '@/bin/repository/mongo-repository';
import { AccountMongoRepository } from '@/modules/account/repositories/account-mongo-repository';
import { UpdatePassword } from '@/modules/account/usecases/update-password/update-password';
import { DbUpdatePassword } from '@/modules/account/usecases/update-password/db/db-update-password';
import { BcryptAdapter } from '@/bin/infra/criptography/bcrypt-adapter/bcrypt-adapter';

export const makeDbUpdatePassword = (): UpdatePassword => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const mongoRepository = new MongoRepository('accounts');
  const accountMongoRepository = new AccountMongoRepository(mongoRepository);
  return new DbUpdatePassword(
    accountMongoRepository,
    accountMongoRepository,
    bcryptAdapter,
  );
};

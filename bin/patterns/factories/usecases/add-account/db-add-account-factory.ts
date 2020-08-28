import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../../../modules/account/repositories/account-mongo-repository';
import { DbAddAccount } from '../../../../../modules/account/usecases/add-account/db/db-add-account';
import { AddAccount } from '../../../../../modules/account/usecases/add-account/add-account';

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository,
  );
};

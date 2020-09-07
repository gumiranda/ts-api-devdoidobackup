import { DbAuthentication } from '@/modules/account/usecases/auth/db/db-authentication';
import { BcryptAdapter } from '@/bin/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '@/bin/infra/criptography/jwt-adapter/jwt-adapter';
import variables from '@/bin/configuration/variables';
import { AccountMongoRepository } from '@/modules/account/repositories/account-mongo-repository';
import { Authentication } from '@/modules/account/usecases/auth/authentication';
import { MongoRepository } from '@/bin/repository/mongo-repository';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(variables.Security.secretKey);
  const mongoRepository = new MongoRepository('accounts');
  const accountMongoRepository = new AccountMongoRepository(mongoRepository);
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
  );
};

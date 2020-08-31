import { DbAuthentication } from '@/modules/account/usecases/auth/db/db-authentication';
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter';
import variables from '../../../../configuration/variables';
import { AccountMongoRepository } from '@/modules/account/repositories/account-mongo-repository';
import { Authentication } from '@/modules/account/usecases/auth/authentication';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(variables.Security.secretKey);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
  );
};

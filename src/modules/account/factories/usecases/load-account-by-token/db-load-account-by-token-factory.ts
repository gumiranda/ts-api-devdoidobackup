import { LoadAccountByToken } from '@/modules/account/usecases/load-account-by-token/load-account-by-token';
import { DbLoadAccountByToken } from '@/modules/account/usecases/load-account-by-token/db/db-load-account-by-token';
import { JwtAdapter } from '@/bin/infra/criptography/jwt-adapter/jwt-adapter';
import variables from '@/bin/configuration/variables';
import { AccountMongoRepository } from '@/modules/account/repositories/account-mongo-repository';
import { MongoRepository } from '@/bin/base/mongo-repository';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(variables.Security.secretKey);
  const mongoRepository = new MongoRepository('accounts');
  const accountMongoRepository = new AccountMongoRepository(mongoRepository);
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};

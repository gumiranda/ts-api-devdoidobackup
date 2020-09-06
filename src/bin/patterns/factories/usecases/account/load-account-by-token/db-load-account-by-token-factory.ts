import { LoadAccountByToken } from '../../../../../middlewares/protocols/usecases/load-account-by-token';
import { DbLoadAccountByToken } from '../../../../../middlewares/protocols/usecases/db/db-load-account-by-token';
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter';
import variables from '../../../../../configuration/variables';
import { AccountMongoRepository } from '@/modules/account/repositories/account-mongo-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { MongoRepository } from '@/bin/base/mongo-repository';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(variables.Security.secretKey);
  const mongoRepository = new MongoRepository('accounts');
  const accountMongoRepository = new AccountMongoRepository(mongoRepository);
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};

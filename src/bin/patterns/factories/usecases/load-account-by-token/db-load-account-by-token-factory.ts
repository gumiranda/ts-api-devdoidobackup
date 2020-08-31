import { LoadAccountByToken } from '../../../../middlewares/protocols/usecases/load-account-by-token';
import { DbLoadAccountByToken } from '../../../../middlewares/protocols/usecases/db/db-load-account-by-token';
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter';
import variables from '../../../../configuration/variables';
import { AccountMongoRepository } from '@/modules/account/repositories/account-mongo-repository';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(variables.Security.secretKey);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};

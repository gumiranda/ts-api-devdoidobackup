import { LoadUserByToken } from '@/modules/user/usecases/load-user-by-token/load-user-by-token';
import { DbLoadUserByToken } from '@/modules/user/usecases/load-user-by-token/db/db-load-user-by-token';
import { JwtAdapter } from '@/bin/infra/cryptography/jwt-adapter/jwt-adapter';
import variables from '@/bin/configuration/variables';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
import { MongoRepository } from '@/bin/repository/mongo-repository';

export const makeDbLoadUserByToken = (): LoadUserByToken => {
  const jwtAdapter = new JwtAdapter(variables.Security.secretKey);
  const mongoRepository = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoRepository);
  return new DbLoadUserByToken(jwtAdapter, userMongoRepository);
};

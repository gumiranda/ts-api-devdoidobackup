import { JwtAdapter } from '@/bin/infra/cryptography/jwt-adapter/jwt-adapter';
import variables from '@/bin/configuration/variables';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import { AuthenticationFacebook } from '@/modules/user/usecases/auth-fb/authentication-facebook';
import { DbAuthenticationFacebook } from '@/modules/user/usecases/auth-fb/db/db-authentication-facebook';

export const makeDbAuthenticationFacebook = (): AuthenticationFacebook => {
  const jwtAdapter = new JwtAdapter(variables.Security.secretKey);
  const mongoRepository = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoRepository);
  return new DbAuthenticationFacebook(userMongoRepository, jwtAdapter);
};

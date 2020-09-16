import { DbAuthentication } from '@/modules/user/usecases/auth/db/db-authentication';
import { BcryptAdapter } from '@/bin/infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '@/bin/infra/cryptography/jwt-adapter/jwt-adapter';
import variables from '@/bin/configuration/variables';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
import { Authentication } from '@/modules/user/usecases/auth/authentication';
import { MongoRepository } from '@/bin/repository/mongo-repository';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(variables.Security.secretKey);
  const mongoRepository = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoRepository);
  return new DbAuthentication(userMongoRepository, bcryptAdapter, jwtAdapter);
};

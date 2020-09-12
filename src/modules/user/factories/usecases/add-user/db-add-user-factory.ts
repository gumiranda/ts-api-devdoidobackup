import { BcryptAdapter } from '@/bin/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
import { DbAddUser } from '@/modules/user/usecases/add-user/db/db-add-user';
import { AddUser } from '@/modules/user/usecases/add-user/add-user';
import { MongoRepository } from '@/bin/repository/mongo-repository';
export const makeDbAddUser = (): AddUser => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const mongoRepository = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoRepository);
  return new DbAddUser(bcryptAdapter, userMongoRepository, userMongoRepository);
};

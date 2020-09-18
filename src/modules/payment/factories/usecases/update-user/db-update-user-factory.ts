import { UpdateUser } from '@/modules/user/usecases/update-user/update-user';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
import { DbUpdateUser } from '@/modules/user/usecases/update-user/db/db-update-user';

export const makeDbUpdateUser = (): UpdateUser => {
  const mongoRepository = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoRepository);
  return new DbUpdateUser(userMongoRepository);
};

import { MongoRepository } from '@/bin/repository/mongo-repository';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
import { DbLoadUserById } from '@/modules/user/usecases/load-user-by-id/db/db-load-user-by-id';
import { LoadUserById } from '@/modules/user/usecases/load-user-by-id/load-user-by-id';

export const makeDbLoadUserById = (): LoadUserById => {
  const mongoRepository = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoRepository);
  return new DbLoadUserById(userMongoRepository);
};

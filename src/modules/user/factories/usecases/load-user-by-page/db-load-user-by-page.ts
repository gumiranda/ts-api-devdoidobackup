import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
import { DbLoadUserByPage } from '@/modules/user/usecases/load-user-by-page/db/db-load-user-by-page';
import { LoadUserByPage } from '@/modules/user/usecases/load-user-by-page/load-user-by-page';
import { MongoRepository } from '@/bin/repository/mongo-repository';

export const makeDbLoadUserByPage = (): LoadUserByPage => {
  const mongoRepository = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoRepository);
  return new DbLoadUserByPage(userMongoRepository);
};

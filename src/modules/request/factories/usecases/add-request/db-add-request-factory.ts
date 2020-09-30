import { MongoRepository } from '@/bin/repository/mongo-repository';
import { RequestMongoRepository } from '@/modules/request/repositories/request-mongo-repository';
import { AddRequest } from '@/modules/request/usecases/add-request/add-request';
import { DbAddRequest } from '@/modules/request/usecases/add-request/db/db-add-request';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
export const makeDbAddRequest = (): AddRequest => {
  const mongoRepository = new MongoRepository('requests');
  const mongoUserRepository = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoUserRepository);
  const requestMongoRepository = new RequestMongoRepository(mongoRepository);
  return new DbAddRequest(requestMongoRepository, userMongoRepository);
};

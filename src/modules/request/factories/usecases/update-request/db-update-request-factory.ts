import { MongoRepository } from '@/bin/repository/mongo-repository';
import { RequestMongoRepository } from '@/modules/request/repositories/request-mongo-repository';
import { DbUpdateRequest } from '@/modules/request/usecases/update-request/db/db-update-request';
import { UpdateRequest } from '@/modules/request/usecases/update-request/update-request';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';

export const makeDbUpdateRequest = (): UpdateRequest => {
  const mongoRepository = new MongoRepository('requests');
  const mongoUserRepository = new MongoRepository('users');
  const requestMongoRepository = new RequestMongoRepository(mongoRepository);
  const userMongoRepository = new UserMongoRepository(mongoUserRepository);
  return new DbUpdateRequest(requestMongoRepository, userMongoRepository);
};

import { MongoRepository } from '@/bin/repository/mongo-repository';
import { RequestMongoRepository } from '@/modules/request/repositories/request-mongo-repository';
import { DbUpdateRequest } from '@/modules/request/usecases/update-request/db/db-update-request';
import { UpdateRequest } from '@/modules/request/usecases/update-request/update-request';

export const makeDbUpdateRequest = (): UpdateRequest => {
  const mongoRepository = new MongoRepository('requests');
  const requestMongoRepository = new RequestMongoRepository(mongoRepository);
  return new DbUpdateRequest(requestMongoRepository);
};

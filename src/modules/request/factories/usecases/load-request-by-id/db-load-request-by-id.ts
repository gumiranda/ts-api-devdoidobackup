import { MongoRepository } from '@/bin/repository/mongo-repository';
import { RequestMongoRepository } from '@/modules/request/repositories/request-mongo-repository';
import { DbLoadRequestById } from '@/modules/request/usecases/load-request-by-id/db/db-load-request-by-id';
import { LoadRequestById } from '@/modules/request/usecases/load-request-by-id/load-request-by-id';

export const makeDbLoadRequestById = (): LoadRequestById => {
  const mongoRepository = new MongoRepository('requests');
  const requestMongoRepository = new RequestMongoRepository(mongoRepository);
  return new DbLoadRequestById(requestMongoRepository);
};

import { MongoRepository } from '@/bin/repository/mongo-repository';
import { RequestMongoRepository } from '@/modules/request/repositories/request-mongo-repository';
import { DbLoadRequestByPage } from '@/modules/request/usecases/load-request-by-page/db/db-load-request-by-page';
import { LoadRequestByPage } from '@/modules/request/usecases/load-request-by-page/load-request-by-page';

export const makeDbLoadRequestByPage = (): LoadRequestByPage => {
  const mongoRepository = new MongoRepository('requests');
  const requestMongoRepository = new RequestMongoRepository(mongoRepository);
  return new DbLoadRequestByPage(requestMongoRepository);
};

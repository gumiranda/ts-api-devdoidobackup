import { MongoRepository } from '@/bin/repository/mongo-repository';
import { CardMongoRepository } from '@/modules/payment/repositories/card/card-mongo-repository';
import { DbLoadCardById } from '@/modules/payment/usecases/load-card-by-id/db/db-load-card-by-id';
import { LoadCardById } from '@/modules/payment/usecases/load-card-by-id/load-card-by-id';

export const makeDbLoadCardById = (): LoadCardById => {
  const mongoRepository = new MongoRepository('cards');
  const cardMongoRepository = new CardMongoRepository(mongoRepository);
  return new DbLoadCardById(cardMongoRepository);
};

import { MongoRepository } from '@/bin/repository/mongo-repository';
import { CardMongoRepository } from '@/modules/payment/repositories/card/card-mongo-repository';
import { DbLoadCardByPage } from '@/modules/payment/usecases/load-card-by-page/db/db-load-card-by-page';
import { LoadCardByPage } from '@/modules/payment/usecases/load-card-by-page/load-card-by-page';

export const makeDbLoadCardByPage = (): LoadCardByPage => {
  const mongoRepository = new MongoRepository('cards');
  const cardMongoRepository = new CardMongoRepository(mongoRepository);
  return new DbLoadCardByPage(cardMongoRepository);
};

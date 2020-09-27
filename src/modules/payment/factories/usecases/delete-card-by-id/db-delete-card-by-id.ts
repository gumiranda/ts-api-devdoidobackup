import { MongoRepository } from '@/bin/repository/mongo-repository';
import { CardMongoRepository } from '@/modules/payment/repositories/card/card-mongo-repository';
import { DbDeleteCardById } from '@/modules/payment/usecases/delete-card-by-id/db/db-delete-card-by-id';
import { DeleteCardById } from '@/modules/payment/usecases/delete-card-by-id/delete-card-by-id';

export const makeDbDeleteCardById = (): DeleteCardById => {
  const mongoRepository = new MongoRepository('cards');
  const cardMongoRepository = new CardMongoRepository(mongoRepository);
  return new DbDeleteCardById(cardMongoRepository);
};

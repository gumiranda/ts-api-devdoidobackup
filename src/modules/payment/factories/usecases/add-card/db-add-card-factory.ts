import { MongoRepository } from '@/bin/repository/mongo-repository';
import { CardMongoRepository } from '@/modules/payment/repositories/card/card-mongo-repository';
import { AddCard } from '@/modules/payment/usecases/add-card/add-card';
import { DbAddCard } from '@/modules/payment/usecases/add-card/db/db-add-card';
export const makeDbAddCard = (): AddCard => {
  const mongoRepository = new MongoRepository('cards');
  const cardMongoRepository = new CardMongoRepository(mongoRepository);
  return new DbAddCard(cardMongoRepository);
};

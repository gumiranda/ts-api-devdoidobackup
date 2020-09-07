import { AddRating } from '@/modules/rating/usecases/add-rating/add-rating';
import { RatingMongoRepository } from '@/modules/rating/repositories/rating/rating-mongo-repository';
import { DbAddRating } from '@/modules/rating/usecases/add-rating/db/db-add-rating';
import { MongoRepository } from '@/bin/repository/mongo-repository';

export const makeDbAddRating = (): AddRating => {
  const mongoRepository = new MongoRepository('ratings');
  const ratingMongoRepository = new RatingMongoRepository(mongoRepository);
  return new DbAddRating(ratingMongoRepository);
};

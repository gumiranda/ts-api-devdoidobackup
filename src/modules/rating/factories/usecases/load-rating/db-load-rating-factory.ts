import { LoadRating } from '@/modules/rating/usecases/load-rating/load-rating';
import { RatingMongoRepository } from '@/modules/rating/repositories/rating/rating-mongo-repository';
import { DbLoadRating } from '@/modules/rating/usecases/load-rating/db/db-load-rating';
import { MongoRepository } from '@/bin/repository/mongo-repository';

export const makeDbLoadRating = (): LoadRating => {
  const mongoRepository = new MongoRepository('ratings');
  const ratingMongoRepository = new RatingMongoRepository(mongoRepository);
  return new DbLoadRating(ratingMongoRepository);
};

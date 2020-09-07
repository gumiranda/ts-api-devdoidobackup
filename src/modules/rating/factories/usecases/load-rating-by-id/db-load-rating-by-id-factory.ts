import { RatingMongoRepository } from '@/modules/rating/repositories/rating/rating-mongo-repository';
import { LoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/load-rating-by-id';
import { DbLoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/db/db-load-rating-by-id';
import { MongoRepository } from '@/bin/repository/mongo-repository';

export const makeDbLoadRatingById = (): LoadRatingById => {
  const mongoRepository = new MongoRepository('ratings');
  const ratingMongoRepository = new RatingMongoRepository(mongoRepository);
  return new DbLoadRatingById(ratingMongoRepository);
};

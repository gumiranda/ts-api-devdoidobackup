import { RatingMongoRepository } from '@/modules/rating/repositories/rating/rating-mongo-repository';
import { LoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/load-rating-by-id';
import { DbLoadRatingById } from '@/modules/rating/usecases/load-rating-by-id/db/db-load-rating-by-id';

export const makeDbLoadRatingById = (): LoadRatingById => {
  const ratingMongoRepository = new RatingMongoRepository();
  return new DbLoadRatingById(ratingMongoRepository);
};

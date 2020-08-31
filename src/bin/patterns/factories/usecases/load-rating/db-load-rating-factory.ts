import { LoadRating } from '@/modules/rating/usecases/load-rating/load-rating';
import { RatingMongoRepository } from '@/modules/rating/repositories/rating-mongo-repository';
import { DbLoadRating } from '@/modules/rating/usecases/load-rating/db/db-load-rating';

export const makeDbLoadRating = (): LoadRating => {
  const ratingMongoRepository = new RatingMongoRepository();
  return new DbLoadRating(ratingMongoRepository);
};

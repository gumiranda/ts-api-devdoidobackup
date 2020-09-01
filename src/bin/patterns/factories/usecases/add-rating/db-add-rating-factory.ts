import { AddRating } from '@/modules/rating/usecases/add-rating/add-rating';
import { RatingMongoRepository } from '@/modules/rating/repositories/rating/rating-mongo-repository';
import { DbAddRating } from '@/modules/rating/usecases/add-rating/db/db-add-rating';

export const makeDbAddRating = (): AddRating => {
  const ratingMongoRepository = new RatingMongoRepository();
  return new DbAddRating(ratingMongoRepository);
};

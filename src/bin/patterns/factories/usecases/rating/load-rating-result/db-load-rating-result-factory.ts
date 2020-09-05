import { LoadRatingResult } from '@/modules/rating/usecases/load-rating-result/load-rating-result';
import { DbLoadRatingResult } from '@/modules/rating/usecases/load-rating-result/db/db-load-rating-result';
import { RatingResultMongoRepository } from '@/modules/rating/repositories/rating-result/rating-result-mongo-repository';
import { RatingMongoRepository } from '@/modules/rating/repositories/rating/rating-mongo-repository';

export const makeDbLoadRatingResult = (): LoadRatingResult => {
  const ratingResultMongoRepository = new RatingResultMongoRepository();
  const ratingMongoRepository = new RatingMongoRepository();
  return new DbLoadRatingResult(
    ratingResultMongoRepository,
    ratingMongoRepository,
  );
};

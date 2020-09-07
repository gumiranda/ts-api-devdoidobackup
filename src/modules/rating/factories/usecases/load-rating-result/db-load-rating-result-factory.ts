import { LoadRatingResult } from '@/modules/rating/usecases/load-rating-result/load-rating-result';
import { DbLoadRatingResult } from '@/modules/rating/usecases/load-rating-result/db/db-load-rating-result';
import { RatingResultMongoRepository } from '@/modules/rating/repositories/rating-result/rating-result-mongo-repository';
import { RatingMongoRepository } from '@/modules/rating/repositories/rating/rating-mongo-repository';
import { MongoRepository } from '@/bin/repository/mongo-repository';

export const makeDbLoadRatingResult = (): LoadRatingResult => {
  const mongoRatingResultRepository = new MongoRepository('ratingResults');
  const ratingResultMongoRepository = new RatingResultMongoRepository(
    mongoRatingResultRepository,
  );
  const mongoRepository = new MongoRepository('ratings');
  const ratingMongoRepository = new RatingMongoRepository(mongoRepository);
  return new DbLoadRatingResult(
    ratingResultMongoRepository,
    ratingMongoRepository,
  );
};

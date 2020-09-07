import { SaveRatingResult } from '@/modules/rating/usecases/save-rating-result/save-rating-result';
import { DbSaveRatingResult } from '@/modules/rating/usecases/save-rating-result/db/db-save-rating-result';
import { RatingResultMongoRepository } from '@/modules/rating/repositories/rating-result/rating-result-mongo-repository';
import { MongoRepository } from '@/bin/repository/mongo-repository';

export const makeDbSaveRatingResult = (): SaveRatingResult => {
  const mongoRepository = new MongoRepository('ratingResults');
  const ratingResultMongoRepository = new RatingResultMongoRepository(
    mongoRepository,
  );
  return new DbSaveRatingResult(
    ratingResultMongoRepository,
    ratingResultMongoRepository,
  );
};

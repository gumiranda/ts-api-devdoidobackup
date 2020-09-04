import { SaveRatingResult } from '@/modules/rating/usecases/save-rating-result/save-rating-result';
import { DbSaveRatingResult } from '@/modules/rating/usecases/save-rating-result/db/db-save-rating-result';
import { RatingResultMongoRepository } from '@/modules/rating/repositories/rating-result/rating-result-mongo-repository';

export const makeDbSaveRatingResult = (): SaveRatingResult => {
  const ratingResultMongoRepository = new RatingResultMongoRepository();
  const loadratingResultMongoRepository = new RatingResultMongoRepository();
  return new DbSaveRatingResult(
    ratingResultMongoRepository,
    loadratingResultMongoRepository,
  );
};

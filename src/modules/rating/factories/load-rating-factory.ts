import { Controller } from '@/bin/protocols/controller';
import { LoadRatingController } from '../controllers/load-rating/load-rating-controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadRating } from '@/bin/patterns/factories/usecases/rating/load-rating/db-load-rating-factory';

export const makeLoadRatingsController = (): Controller => {
  const loadRatingController = new LoadRatingController(makeDbLoadRating());
  return makeLogControllerDecorator(loadRatingController);
};

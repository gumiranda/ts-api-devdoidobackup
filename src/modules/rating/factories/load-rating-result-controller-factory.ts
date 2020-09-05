import { Controller } from '@/bin/protocols/controller';
import { LoadRatingResultController } from '../controllers/load-survey-result/load-rating-result.controller';
import { makeDbLoadRatingById } from '@/bin/patterns/factories/usecases/rating/load-rating-by-id/db-load-rating-by-id-factory';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadRatingResult } from '@/bin/patterns/factories/usecases/rating/load-rating-result/db-load-rating-result-factory';

export const makeLoadRatingResultsController = (): Controller => {
  const loadRatingController = new LoadRatingResultController(
    makeDbLoadRatingById(),
    makeDbLoadRatingResult(),
  );
  return makeLogControllerDecorator(loadRatingController);
};

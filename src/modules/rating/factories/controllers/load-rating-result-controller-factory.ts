import { Controller } from '@/bin/protocols/controller';
import { LoadRatingResultController } from '@/modules/rating/controllers/load-rating-result/load-rating-result.controller';
import { makeDbLoadRatingById } from '@/modules/rating/factories/usecases/load-rating-by-id/db-load-rating-by-id-factory';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadRatingResult } from '@/modules/rating/factories/usecases/load-rating-result/db-load-rating-result-factory';

export const makeLoadRatingResultsController = (): Controller => {
  const loadRatingController = new LoadRatingResultController(
    makeDbLoadRatingById(),
    makeDbLoadRatingResult(),
  );
  return makeLogControllerDecorator(loadRatingController);
};

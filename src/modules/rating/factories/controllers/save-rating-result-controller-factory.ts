import { Controller } from '@/bin/protocols/controller';
import { SaveRatingResultController } from '@/modules/rating/controllers/save-rating-result/save-rating-result-controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeDbSaveRatingResult } from '@/modules/rating/factories/usecases/save-rating-result/db-save-rating-result-factory';
import { makeDbLoadRatingById } from '@/modules/rating/factories/usecases/load-rating-by-id/db-load-rating-by-id-factory';

export const makeSaveRatingResultsController = (): Controller => {
  const loadRatingController = new SaveRatingResultController(
    makeDbLoadRatingById(),
    makeDbSaveRatingResult(),
  );
  return makeLogControllerDecorator(loadRatingController);
};

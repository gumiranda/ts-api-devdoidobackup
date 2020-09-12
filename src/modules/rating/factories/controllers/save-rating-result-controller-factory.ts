import { makeDbLoadAccountByPage } from '@/modules/account/factories/usecases/load-account-by-page/db-load-account-by-page';
import { Controller } from '@/bin/protocols/controller';
import { SaveRatingResultController } from '@/modules/rating/controllers/save-rating-result/save-rating-result-controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeDbSaveRatingResult } from '@/modules/rating/factories/usecases/save-rating-result/db-save-rating-result-factory';
import { makeDbLoadRatingById } from '@/modules/rating/factories/usecases/load-rating-by-id/db-load-rating-by-id-factory';
import { makeDbLoadAccountById } from '@/modules/account/factories/usecases/load-account-by-id/db-load-account-by-id';

export const makeSaveRatingResultsController = (): Controller => {
  const loadRatingController = new SaveRatingResultController(
    makeDbLoadRatingById(),
    makeDbLoadAccountById(),
    makeDbSaveRatingResult(),
  );
  return makeLogControllerDecorator(loadRatingController);
};

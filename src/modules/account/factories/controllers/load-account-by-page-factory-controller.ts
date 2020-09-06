import { Controller } from '@/bin/protocols/controller';
import { LoadAccountByPageController } from '@/modules/account/controllers/load-account-by-page/load-account-by-page';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadAccountByPage } from '@/modules/account/factories/usecases/load-account-by-page/db-load-account-by-page';

export const makeLoadAccountByPageController = (): Controller => {
  const loadRatingController = new LoadAccountByPageController(
    makeDbLoadAccountByPage(),
  );
  return makeLogControllerDecorator(loadRatingController);
};

import { Controller } from '@/bin/protocols/controller';
import { LoadUserByPageController } from '@/modules/user/controllers/load-user-by-page/load-user-by-page';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadUserByPage } from '@/modules/user/factories/usecases/load-user-by-page/db-load-user-by-page';

export const makeLoadUserByPageController = (): Controller => {
  const loadRatingController = new LoadUserByPageController(
    makeDbLoadUserByPage(),
  );
  return makeLogControllerDecorator(loadRatingController);
};

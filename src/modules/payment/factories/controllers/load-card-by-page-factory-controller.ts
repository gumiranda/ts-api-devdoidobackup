import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { Controller } from '@/bin/protocols/controller';
import { LoadCardByPageController } from '../../controllers/load-card-by-page/load-card-by-page';
import { makeDbLoadCardByPage } from '../usecases/load-card-by-page/db-load-card-by-page';

export const makeLoadCardByPageController = (): Controller => {
  const loadCardController = new LoadCardByPageController(
    makeDbLoadCardByPage(),
  );
  return makeLogControllerDecorator(loadCardController);
};

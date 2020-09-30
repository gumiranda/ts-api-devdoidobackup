import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { Controller } from '@/bin/protocols/controller';
import { LoadRequestByPageController } from '../../controllers/load-request-by-page/load-request-by-page';
import { makeDbLoadRequestByPage } from '../usecases/load-request-by-page/db-load-request-by-page';

export const makeLoadRequestByPageController = (): Controller => {
  const loadRequestController = new LoadRequestByPageController(
    makeDbLoadRequestByPage(),
  );
  return makeLogControllerDecorator(loadRequestController);
};

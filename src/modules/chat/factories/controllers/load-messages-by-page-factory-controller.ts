import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { Controller } from '@/bin/protocols/controller';
import { LoadMessagesByPageController } from '../../controllers/load-messages-by-page/load-messages-by-page';
import { makeDbLoadMessagesByPage } from '../usecases/load-messages-by-page/db-load-messages-by-page';

export const makeLoadMessagesByPageController = (): Controller => {
  const loadMessagesController = new LoadMessagesByPageController(
    makeDbLoadMessagesByPage(),
  );
  return makeLogControllerDecorator(loadMessagesController);
};

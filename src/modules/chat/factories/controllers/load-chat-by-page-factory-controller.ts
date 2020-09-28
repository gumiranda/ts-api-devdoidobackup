import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { Controller } from '@/bin/protocols/controller';
import { LoadChatByPageController } from '../../controllers/load-chat-by-page/load-chat-by-page';
import { makeDbLoadChatByPage } from '../usecases/load-chat-by-page/db-load-chat-by-page';

export const makeLoadChatByPageController = (): Controller => {
  const loadChatController = new LoadChatByPageController(
    makeDbLoadChatByPage(),
  );
  return makeLogControllerDecorator(loadChatController);
};
